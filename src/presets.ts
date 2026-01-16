import { combineRgb, type CompanionPresetDefinitions, type CompanionButtonPresetDefinition } from '@companion-module/base'
import { ActionId } from './actions.js'
import type { SequenceInfo, TransportState } from './client.js'

interface CompanionPresetExt extends CompanionButtonPresetDefinition {
  feedbacks: CompanionButtonPresetDefinition['feedbacks']
  steps: Array<{
    down: Array<
      {
        actionId: ActionId
      } & CompanionButtonPresetDefinition['steps'][0]['down'][0]
    >
    up: Array<
      {
        actionId: ActionId
      } & CompanionButtonPresetDefinition['steps'][0]['up'][0]
    >
  }>
}

interface CompanionPresetDefinitionsExt {
  [id: string]: CompanionPresetExt | undefined
}

const White = combineRgb(255, 255, 255)
const Black = combineRgb(0, 0, 0)
const Green = combineRgb(0, 200, 0)
const Red = combineRgb(200, 0, 0)
const Blue = combineRgb(0, 100, 200)
const Orange = combineRgb(255, 150, 0)
const Purple = combineRgb(150, 0, 200)

export function GetPresetsList(
  sequences: SequenceInfo[],
  _getSequenceStates: () => Map<number, TransportState>,
): CompanionPresetDefinitions {
  const presets: CompanionPresetDefinitionsExt = {}

  // ========== Dynamic Sequence Selection ==========

  for (const seq of sequences) {
    presets[`seq_select_${seq.id}`] = {
      type: 'button',
      category: 'Sequence Selection',
      name: `Select ${seq.name} (${seq.id})`,
      style: {
        text: `Edit:\n${seq.name}\n(${seq.id})`,
        size: 'auto',
        color: White,
        bgcolor: Blue,
      },
      feedbacks: [],
      steps: [
        {
          down: [
            {
              actionId: ActionId.SelectSequence,
              options: {
                sequence: seq.id,
              },
            },
          ],
          up: [],
        },
      ],
    }
  }

  // ========== Dynamic SMPTE Timecode Mode ==========

  const Yellow = combineRgb(200, 200, 0)
  const Gray = combineRgb(80, 80, 80)

  for (const seq of sequences) {
    // SMPTE None (Off)
    presets[`seq_smpte_none_${seq.id}`] = {
      type: 'button',
      category: 'SMPTE Timecode',
      name: `${seq.name} (${seq.id}): SMPTE Off`,
      style: {
        text: `${seq.name} (${seq.id})\nSMPTE Off`,
        size: 'auto',
        color: White,
        bgcolor: Gray,
      },
      feedbacks: [],
      steps: [
        {
          down: [
            {
              actionId: ActionId.SetSmpteMode,
              options: {
                sequence: seq.id,
                mode: 0,
              },
            },
          ],
          up: [],
        },
      ],
    }

    // SMPTE Send
    presets[`seq_smpte_send_${seq.id}`] = {
      type: 'button',
      category: 'SMPTE Timecode',
      name: `${seq.name} (${seq.id}): SMPTE Send`,
      style: {
        text: `${seq.name} (${seq.id})\nSMPTE Send`,
        size: 'auto',
        color: Black,
        bgcolor: Yellow,
      },
      feedbacks: [],
      steps: [
        {
          down: [
            {
              actionId: ActionId.SetSmpteMode,
              options: {
                sequence: seq.id,
                mode: 1,
              },
            },
          ],
          up: [],
        },
      ],
    }

    // SMPTE Receive
    presets[`seq_smpte_receive_${seq.id}`] = {
      type: 'button',
      category: 'SMPTE Timecode',
      name: `${seq.name} (${seq.id}): SMPTE Receive`,
      style: {
        text: `${seq.name} (${seq.id})\nSMPTE Recv`,
        size: 'auto',
        color: White,
        bgcolor: Purple,
      },
      feedbacks: [],
      steps: [
        {
          down: [
            {
              actionId: ActionId.SetSmpteMode,
              options: {
                sequence: seq.id,
                mode: 2,
              },
            },
          ],
          up: [],
        },
      ],
    }
  }

  // ========== Application ==========

  presets['app_save_project'] = {
    type: 'button',
    category: 'Application',
    name: 'Save Project',
    style: {
      text: 'Save\\nProject',
      size: 'auto',
      color: White,
      bgcolor: Blue,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.SaveProject, options: {} }],
        up: [],
      },
    ],
  }

  presets['app_toggle_fullscreen'] = {
    type: 'button',
    category: 'Application',
    name: 'Toggle Fullscreen',
    style: {
      text: 'Fullscreen\\nSite 1',
      size: 'auto',
      color: White,
      bgcolor: Blue,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.ToggleFullscreen, options: { site: 1 } }],
        up: [],
      },
    ],
  }

  presets['app_recall_view'] = {
    type: 'button',
    category: 'Application',
    name: 'Recall GUI View',
    style: {
      text: 'View 1',
      size: 'auto',
      color: White,
      bgcolor: Blue,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.ApplyView, options: { view: 1 } }],
        up: [],
      },
    ],
  }

  presets['app_set_site_ip'] = {
    type: 'button',
    category: 'Application',
    name: 'Set Site IP',
    style: {
      text: 'Set Site IP\\nID 1',
      size: 'auto',
      color: White,
      bgcolor: Blue,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.SetSiteIp, options: { site: 1, ip: '192.168.1.100' } }],
        up: [],
      },
    ],
  }

  // ========== Programming ==========

  presets['prog_clear_active'] = {
    type: 'button',
    category: 'Programming',
    name: 'Clear All Active',
    style: {
      text: 'Clear\nActive',
      size: 'auto',
      color: White,
      bgcolor: Red,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.ClearAllActive, options: {} }],
        up: [],
      },
    ],
  }

  presets['prog_store_active'] = {
    type: 'button',
    category: 'Programming',
    name: 'Store Active',
    style: {
      text: 'Store\nActive',
      size: 'auto',
      color: Black,
      bgcolor: Orange,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.StoreActive, options: { seq: 1 } }],
        up: [],
      },
    ],
  }

  presets['prog_store_active_begin'] = {
    type: 'button',
    category: 'Programming',
    name: 'Store Active to Container Beginning',
    style: {
      text: 'Store\nCont. Beg.',
      size: 'auto',
      color: Black,
      bgcolor: Orange,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.StoreActiveToBeginning, options: { seq: 1 } }],
        up: [],
      },
    ],
  }

  presets['prog_reset_all'] = {
    type: 'button',
    category: 'Programming',
    name: 'Reset All',
    style: {
      text: 'Reset\nAll',
      size: 'auto',
      color: White,
      bgcolor: Red,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.ResetAll, options: {} }],
        up: [],
      },
    ],
  }

  // ========== Sequence Control ==========

  presets['seq_goto_cue'] = {
    type: 'button',
    category: 'Sequence Control',
    name: 'Goto Cue',
    style: {
      text: 'Goto\\nCue 1',
      size: 'auto',
      color: White,
      bgcolor: Green,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.GotoCue, options: { seq: 1, cue: 1 } }],
        up: [],
      },
    ],
  }

  presets['seq_next_cue'] = {
    type: 'button',
    category: 'Sequence Control',
    name: 'Next Cue',
    style: {
      text: 'Next\\nCue',
      size: 'auto',
      color: White,
      bgcolor: Green,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.NextLastCue, options: { seq: 1, isNext: 1 } }],
        up: [],
      },
    ],
  }

  presets['seq_last_cue'] = {
    type: 'button',
    category: 'Sequence Control',
    name: 'Last Cue',
    style: {
      text: 'Last\\nCue',
      size: 'auto',
      color: White,
      bgcolor: Green,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.NextLastCue, options: { seq: 1, isNext: 0 } }],
        up: [],
      },
    ],
  }

  presets['seq_ignore_next'] = {
    type: 'button',
    category: 'Sequence Control',
    name: 'Ignore Next Cue',
    style: {
      text: 'Ignore\\nNext',
      size: 'auto',
      color: White,
      bgcolor: Orange,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.IgnoreNextCue, options: { seq: 1, doIgnore: 1 } }],
        up: [],
      },
    ],
  }

  presets['seq_transport_play'] = {
    type: 'button',
    category: 'Sequence Control',
    name: 'Sequence Play',
    style: {
      text: '▶\\nPlay',
      size: 'auto',
      color: White,
      bgcolor: Green,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.SeqTransport, options: { seq: 1, mode: 1 } }],
        up: [],
      },
    ],
  }

  presets['seq_transport_pause'] = {
    type: 'button',
    category: 'Sequence Control',
    name: 'Sequence Pause',
    style: {
      text: '⏸\\nPause',
      size: 'auto',
      color: White,
      bgcolor: Orange,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.SeqTransport, options: { seq: 1, mode: 3 } }],
        up: [],
      },
    ],
  }

  presets['seq_transport_stop'] = {
    type: 'button',
    category: 'Sequence Control',
    name: 'Sequence Stop',
    style: {
      text: '⏹\\nStop',
      size: 'auto',
      color: White,
      bgcolor: Red,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.SeqTransport, options: { seq: 1, mode: 2 } }],
        up: [],
      },
    ],
  }

  // ========== Programming ==========

  presets['prog_clear_active'] = {
    type: 'button',
    category: 'Programming',
    name: 'Clear All Active',
    style: {
      text: 'Clear\\nAll Active',
      size: 'auto',
      color: White,
      bgcolor: Red,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.ClearAllActive, options: {} }],
        up: [],
      },
    ],
  }

  presets['prog_reset_all'] = {
    type: 'button',
    category: 'Programming',
    name: 'Reset All Values',
    style: {
      text: 'Reset\\nAll',
      size: 'auto',
      color: White,
      bgcolor: Red,
    },
    feedbacks: [],
    steps: [
      {
        down: [{ actionId: ActionId.ResetAll, options: {} }],
        up: [],
      },
    ],
  }

  return presets
}
