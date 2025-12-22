# companion-module-twoloox-pandorasbox

Companion module for controlling **Christie/TwoLooX Pandoras Box** media servers via the **PandorasAutomation (PBAU)** TCP protocol.

## Features

✅ **Sequence Control**
- Play/Pause/Stop sequences
- Goto Cue, Next/Last Cue
- Ignore Next Cue
- SMPTE Timecode Mode (None/Send/Receive)
- Real-time timecode display (30fps)
- Sequence selection for editing

✅ **Programming**
- Store Active to Sequence
- Store Active to Beginning
- Clear All Active
- Reset All

✅ **Project Management**
- Save Project
- Toggle Site Fullscreen
- Set Site IP Address
- Apply GUI View

✅ **Dynamic Features**
- Automatic sequence discovery
- Per-sequence timecode polling (30x/sec when playing)
- 26+ dynamic presets (4 per sequence)
- Real-time status variables

## Tested Versions

- **Companion:** v4.2
- **Pandoras Box:** v8.11.3

## Installation

### For Development

1. **Prerequisites:**
   - Node.js 22+
   - Yarn 4
   - Git

2. **Clone and Install:**
   ```powershell
   git clone https://dev.azure.com/twoloox/Companion%20Plugins/_git/companion-module-twoloox-pandorasbox
   cd companion-module-twoloox-pandorasbox
   yarn install
   ```

3. **Build:**
   ```powershell
   yarn build
   ```

4. **Link to Companion (Development Setup):**
   
   **Option A: Using companion-module-dev-link**
   ```powershell
   # Install the dev link tool globally
   npm install -g @companion-module/dev-link
   
   # Link this module to Companion
   companion-module-dev-link add twoloox-pandorasbox
   ```
   
   **Option B: Manual Symlink**
   ```powershell
   # Windows (as Administrator)
   cd "C:\Users\<USERNAME>\companion-module-dev"
   mklink /D "companion-module-twoloox-pandorasbox" "C:\path\to\your\repo"
   
   # Restart Companion
   ```

5. **Start Companion in Dev Mode:**
   ```powershell
   # In Companion directory
   yarn dev
   ```

6. **Watch for Changes (Optional):**
   ```powershell
   # In module directory
   yarn dev
   ```
   Companion will auto-reload when you rebuild.

### For Production

Install directly in Companion via the module library (when published) or use the built `dist/` folder.

## Configuration

After adding the module in Companion:

1. **Host:** IP address of Pandoras Box server (e.g., `192.168.1.100`)
2. **Port:** Default `6211`
3. **Domain:** Default `0`

The module will automatically:
- Discover all sequences
- Create dynamic presets
- Start timecode polling for playing sequences

## Dev Scripts

- `yarn dev` — TypeScript watch mode → dist
- `yarn build` — Clean build
- `yarn lint` — ESLint check

## Architecture

### Multi-Connection Design
- **Main TCP Connection:** Sequence discovery, status polling (5x/sec), commands
- **Per-Sequence Connections:** Independent timecode polling (30x/sec when playing, 5x/sec when stopped)

### Protocol Details
- **PBAU Header:** Mixed endianness (BE headers, LE sequence IDs)
- **Commands Implemented:** 15+ (Transport, Cue, Programming, Project, SMPTE)
- **Polling:** Adaptive rate based on sequence state

## Documentation

- [docs/status.md](docs/status.md) - Complete feature list and implementation status
- [docs/learnings.md](docs/learnings.md) - Protocol quirks and debugging notes
- [docs/plan.md](docs/plan.md) - Original development plan
- [reference/](reference/) - SDK references and examples

## Known Limitations

- No feedback implementation yet (status display only via variables)
- Cue discovery not implemented (manual cue ID entry required)
- SMPTE mode cannot be read back (write-only command)

## Future Enhancements

See [docs/status.md](docs/status.md) for the full roadmap including:
- Feedbacks (sequence status, SMPTE mode)
- Parameter control (Layer opacity, position, scale)
- Device selection and resource assignment
- Playlist management

## License

See project license file.

## Support

For issues and feature requests, contact TwoLooX or submit via Azure DevOps.
