import {
  InstanceBase,
  InstanceStatus,
  runEntrypoint,
  type SomeCompanionConfigField,
} from '@companion-module/base'
import { GetActionsList } from './actions.js'
import { GetConfigFields, type DeviceConfig } from './config.js'
import { GetFeedbacksList, type ModuleState } from './feedback.js'
import { GetPresetsList } from './presets.js'
import { PBClient, type TransportState, type SequenceInfo } from './client.js'
import { GetVariableDefinitions, GetSequenceVariableDefinitions, GetSequenceVariableValues, GetSequenceStatusVariableDefinitions, GetSequenceStatusVariableValues, GetSequenceTimeVariableDefinitions, GetSequenceTimeVariableValues, type SequenceTime } from './variables.js'
import { UpgradeScripts } from './upgrades.js'

class TwolooxPandorasInstance extends InstanceBase<DeviceConfig> {
  private client: PBClient | undefined
  private state: ModuleState = {
    transport: 'Unknown' as TransportState,
    remaining: { h: 0, m: 0, s: 0, f: 0 },
  }
  private sequences: SequenceInfo[] = []
  private sequenceRefreshTimer: NodeJS.Timeout | undefined
  private sequenceStates: Map<number, TransportState> = new Map()
  private sequenceTimes: Map<number, SequenceTime> = new Map()

  public getSequenceChoices(): { id: number; label: string }[] {
    if (this.sequences.length === 0) {
      return [{ id: 1, label: 'Sequence 1 (not connected)' }]
    }
    return this.sequences.map((seq) => ({
      id: seq.id,
      label: `${seq.id}: ${seq.name}`,
    }))
  }

  private updateActionDefinitions(): void {
    this.setActionDefinitions(
      GetActionsList(
        () => this.client,
        () => this.getSequenceChoices(),
        (seqId) => this.sequenceStates.get(seqId) || 'Unknown',
      ),
    )
  }

  public async init(config: DeviceConfig): Promise<void> {
    this.updateActionDefinitions()
    this.setFeedbackDefinitions(
      GetFeedbacksList(
        () => this.state,
        () => this.getSequenceChoices(),
        (seqId) => this.sequenceStates.get(seqId) || 'Unknown',
      ),
    )
    this.setPresetDefinitions(GetPresetsList(this.sequences, () => this.sequenceStates))
    this.setVariableDefinitions(GetVariableDefinitions())

    await this.configUpdated(config)
  }

  public async destroy(): Promise<void> {
    if (this.sequenceRefreshTimer) {
      clearInterval(this.sequenceRefreshTimer)
      this.sequenceRefreshTimer = undefined
    }
    this.client?.disconnect()
    this.client = undefined
  }

  public getConfigFields(): SomeCompanionConfigField[] {
    return GetConfigFields()
  }

  public async configUpdated(config: DeviceConfig): Promise<void> {
    if (this.sequenceRefreshTimer) {
      clearInterval(this.sequenceRefreshTimer)
      this.sequenceRefreshTimer = undefined
    }
    this.client?.disconnect()
    this.client = undefined
    this.sequences = []

    const host = config.host?.trim()
    const domain = Number(config.domain ?? 0)

    if (!host) {
      this.updateStatus(InstanceStatus.BadConfig, 'Host is required')
      return
    }

    this.updateStatus(InstanceStatus.Connecting)
    const client = new PBClient(host, domain, {
      onTransport: (state) => {
        this.state.transport = state
      },
      onSequenceTransport: (seqId, state) => {
        this.sequenceStates.set(seqId, state)
        this.updateSequenceStatusVariables()
        this.checkFeedbacks()
      },
      onSequenceTime: (seqId, h, m, s, f) => {
        this.sequenceTimes.set(seqId, { h, m, s, f })
        this.updateSequenceTimeVariables()
      },
      onSequencesUpdated: (sequences) => {
        this.log('info', `Received ${sequences.length} sequences from Pandoras Box`)
        this.sequences = sequences
        // Update actions with new sequence choices
        this.updateActionDefinitions()
        // Update variable definitions and values for sequences
        this.updateSequenceVariables()
        // Start polling sequence statuses
        this.client?.setPollSequences(sequences.map((s) => s.id))
        // Update presets with new sequences
        this.updatePresetDefinitions()
      },
      onDebug: (message) => {
        this.log('debug', `[PBClient] ${message}`)
      },
      onError: (err) => {
        this.log('error', err.message)
        this.updateStatus(InstanceStatus.UnknownError, err.message)
      },
    })

    this.client = client

    try {
      await client.connect()
      this.updateStatus(InstanceStatus.Ok)
      this.log('info', 'Connected to Pandoras Box, requesting sequences...')
      // Fetch sequences immediately and then every 10 seconds
      const refreshSequences = () => {
        this.log('debug', 'Refreshing sequences...')
        void client.refreshSequences()
      }
      // Initial refresh after 500ms
      setTimeout(refreshSequences, 500)
      // Then refresh every 10 seconds
      this.sequenceRefreshTimer = setInterval(refreshSequences, 10000)
    } catch (e: any) {
      const msg = e?.message ?? 'Connect failed'
      this.log('error', msg)
      this.updateStatus(InstanceStatus.UnknownError, msg)
    }
  }

  private updateSequenceVariables(): void {
    // Update variable definitions to include sequence variables
    const baseVars = GetVariableDefinitions()
    const seqVars = GetSequenceVariableDefinitions(this.sequences)
    const statusVars = GetSequenceStatusVariableDefinitions(this.sequences)
    const timeVars = GetSequenceTimeVariableDefinitions(this.sequences)
    this.setVariableDefinitions([...baseVars, ...seqVars, ...statusVars, ...timeVars])

    // Set the sequence variable values
    const seqValues = GetSequenceVariableValues(this.sequences)
    this.setVariableValues(seqValues)
    this.log('debug', `Created ${this.sequences.length} sequence variables (name, status, time)`)
  }

  private updateSequenceStatusVariables(): void {
    const statusValues = GetSequenceStatusVariableValues(this.sequences, this.sequenceStates)
    this.setVariableValues(statusValues)
  }

  private updateSequenceTimeVariables(): void {
    const timeValues = GetSequenceTimeVariableValues(this.sequences, this.sequenceTimes)
    this.setVariableValues(timeValues)
  }

  private updatePresetDefinitions(): void {
    this.setPresetDefinitions(GetPresetsList(this.sequences, () => this.sequenceStates))
  }
}

runEntrypoint(TwolooxPandorasInstance, UpgradeScripts)
