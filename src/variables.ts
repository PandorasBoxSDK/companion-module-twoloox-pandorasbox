import type { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'
import type { SequenceInfo, TransportState } from './client.js'

export function GetVariableDefinitions(): CompanionVariableDefinition[] {
  // Base definitions are empty now - all sequence-specific
  return []
}

// Generate variable definitions for discovered sequences
export function GetSequenceVariableDefinitions(sequences: SequenceInfo[]): CompanionVariableDefinition[] {
  return sequences.map((seq) => ({
    variableId: `sequence_${seq.id}`,
    name: `Sequence ${seq.id} Name`,
  }))
}

// Generate variable values for discovered sequences
export function GetSequenceVariableValues(sequences: SequenceInfo[]): CompanionVariableValues {
  const values: CompanionVariableValues = {}
  for (const seq of sequences) {
    values[`sequence_${seq.id}`] = seq.name
  }
  return values
}

// Generate variable definitions for sequence statuses
export function GetSequenceStatusVariableDefinitions(sequences: SequenceInfo[]): CompanionVariableDefinition[] {
  return sequences.map((seq) => ({
    variableId: `sequence_${seq.id}_status`,
    name: `Sequence ${seq.id} Status`,
  }))
}

// Generate variable values for sequence statuses
export function GetSequenceStatusVariableValues(
  sequences: SequenceInfo[],
  states: Map<number, TransportState>,
): CompanionVariableValues {
  const values: CompanionVariableValues = {}
  for (const seq of sequences) {
    values[`sequence_${seq.id}_status`] = states.get(seq.id) || 'Unknown'
  }
  return values
}

// Generate variable definitions for sequence times
export function GetSequenceTimeVariableDefinitions(sequences: SequenceInfo[]): CompanionVariableDefinition[] {
  return sequences.map((seq) => ({
    variableId: `sequence_${seq.id}_time`,
    name: `Sequence ${seq.id} Time (HH:MM:SS:ff)`,
  }))
}

export interface SequenceTime {
  h: number
  m: number
  s: number
  f: number
}

// Generate variable values for sequence times
export function GetSequenceTimeVariableValues(
  sequences: SequenceInfo[],
  times: Map<number, SequenceTime>,
): CompanionVariableValues {
  const values: CompanionVariableValues = {}
  for (const seq of sequences) {
    const time = times.get(seq.id)
    if (time) {
      const hh = time.h.toString().padStart(2, '0')
      const mm = time.m.toString().padStart(2, '0')
      const ss = time.s.toString().padStart(2, '0')
      const ff = time.f.toString().padStart(2, '0')
      values[`sequence_${seq.id}_time`] = `${hh}:${mm}:${ss}:${ff}`
    } else {
      values[`sequence_${seq.id}_time`] = '00:00:00:00'
    }
  }
  return values
}
