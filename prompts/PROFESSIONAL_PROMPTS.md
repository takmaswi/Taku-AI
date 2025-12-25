# TAKU AI: PROFESSIONAL PROMPT ENGINEERING

Expert-level prompts using best practices for autonomous development with Antigravity Agent.

---

## PROMPT 1: Project Initialization Phase

```
CONTEXT:
You are an expert full-stack developer implementing TAKU AI, an offline AI tutor platform. You have access to the terminal and file system with the following system configuration:
- Node.js: v22.17.0
- Python: 3.13.5
- npm: 10.9.2
- Git: 2.51.0
- Ollama: 0.13.5
- Working directory: taku-ai/

AVAILABLE REFERENCES:
- taku-ai-implementation-guide.md (architectural specification and weekly milestones)
- taku-ai-pdlc-documentation.md (technical requirements and API contracts)
- taku-ai-research-decisions.md (technology selection rationale)

OBJECTIVE:
Initialize the TAKU AI project scaffold using Tauri 2.0 with React 18 and TypeScript as the frontend framework.

TASK SPECIFICATION:
Execute the npm create command to scaffold a new Tauri project configured for:
- Framework: React
- Language: TypeScript
- Build tool: Vite
- Target directory: Current working directory (taku-ai/)

EXECUTION REQUIREMENTS:
- Log all command outputs
- Verify project structure creation
- Confirm no errors during initialization
- Report when ready for dependency installation

PROCEED WITH PROJECT INITIALIZATION.
```

---

## PROMPT 2: Dependency Installation Phase

```
CONTEXT:
Tauri project scaffold has been successfully initialized. Proceeding to install all required dependencies for frontend and backend integration.

OBJECTIVE:
Install frontend (npm) and backend (pip) dependencies for TAKU AI.

TASK SPECIFICATION:
1. Execute: npm install (from project root: taku-ai/)
   - Install all npm dependencies defined in package.json
   - Verify lock file generation (package-lock.json)
   
2. Execute: pip install -r src-tauri/src-python/requirements.txt
   - Install Python dependencies for Tauri backend integration
   - Verify virtual environment configuration if needed

EXECUTION REQUIREMENTS:
- Monitor installation progress for errors
- Report completion status for each package manager
- Verify no version conflicts occur
- Confirm all dependencies installed successfully
- Log final dependency tree

PROCEED WITH DEPENDENCY INSTALLATION.
```

---

## PROMPT 3: AI Model Configuration and Verification

```
CONTEXT:
All dependencies have been installed successfully. TAKU AI requires offline AI capabilities via Ollama with Mistral 7B model for local inference.

OBJECTIVE:
Download and verify the Mistral 7B model is properly configured for production use.

TASK SPECIFICATION:
1. Execute: ollama pull mistral
   - Download Mistral 7B model (approximately 4GB)
   - Monitor download progress and completion
   - Verify model stored in Ollama cache directory

2. Execute: ollama run mistral "Verify model installation: respond with confirmation of successful initialization"
   - Test model responsiveness and inference capability
   - Measure inference latency
   - Verify output quality

EXECUTION REQUIREMENTS:
- Log download completion time
- Verify model is accessible via Ollama API (http://localhost:11434)
- Confirm inference latency is within acceptable parameters
- Report model availability for application integration
- Verify connection string for subsequent API calls

PROCEED WITH MODEL CONFIGURATION AND VERIFICATION.
```

---

## PROMPT 4: Project Configuration and Version Control Initialization

```
CONTEXT:
Core dependencies and AI model are configured and verified. Project requires standardized configuration files and version control initialization per development best practices.

OBJECTIVE:
Establish project configuration files, environment templates, and initialize git version control.

TASK SPECIFICATION:
1. Create .gitignore with comprehensive ignores for:
   - Node ecosystem: node_modules/, dist/, build/, .next/
   - Python ecosystem: __pycache__/, *.pyc, venv/, .venv/
   - Build artifacts: dist/, build/, target/, .cargo/
   - IDE/editor: .vscode/, .idea/, *.swp, .DS_Store
   - Environment/secrets: .env, .env.local, .env.*.local
   - Project specific: .ai-reference/

2. Create .env.example with required environment variables:
   - OLLAMA_BASE_URL=http://localhost:11434
   - OLLAMA_MODEL=mistral
   - DATABASE_URL=sqlite:///~/.taku_ai/student_data.db
   - CHROMA_DB_PATH=~/.taku_ai/chroma
   - APP_ENV=development
   - DEBUG=true

3. Create README.md with:
   - Project description and purpose
   - Quick start instructions
   - Reference documentation structure
   - Technology stack overview
   - Development workflow

4. Initialize version control:
   - Execute: git init
   - Execute: git config user.email "developer@taku-ai.dev"
   - Execute: git config user.name "TAKU AI Developer"
   - Execute: git add .
   - Execute: git commit -m "Initial project scaffold: Tauri 2.0 + React 18 + TypeScript + Python backend"

EXECUTION REQUIREMENTS:
- Verify all configuration files created with syntactically correct content
- Confirm git repository initialized with proper configuration
- Log git status showing all files tracked
- Verify first commit includes all essential files
- Report version control ready for feature branch development

PROCEED WITH CONFIGURATION AND VERSION CONTROL INITIALIZATION.
```

---

## PROMPT 5: Development Environment Validation

```
CONTEXT:
Project scaffold, configuration, and version control are complete. Development environment requires comprehensive validation before feature development commences.

OBJECTIVE:
Launch development server and validate the complete Tauri + React + Python stack is functioning correctly.

TASK SPECIFICATION:
1. Execute: npm run tauri dev
   - Start Tauri development server
   - Monitor for build compilation errors
   - Wait for application window to launch

2. Validate application startup:
   - Confirm Tauri window opens with React app loaded
   - Check browser DevTools for JavaScript errors
   - Verify hot module reload (HMR) is operational
   - Test application interactivity and responsiveness

3. Log operational metrics:
   - Build compilation time
   - First render time
   - Browser console status (errors/warnings)
   - Network tab (no failed requests)

EXECUTION REQUIREMENTS:
- Log complete build output including all phases
- Verify no critical TypeScript compilation errors
- Confirm Tauri IPC bridge initialized and ready
- Test basic window functionality (resize, minimize, etc.)
- Report application ready for feature implementation
- Do not proceed until application demonstrates stability

PROCEED WITH DEVELOPMENT ENVIRONMENT VALIDATION.
```

---

## PROMPT 6: Chat Interface Component Implementation

```
CONTEXT:
Development environment validated and stable. Week 2-3 focuses on implementing the Chat Interface component as specified in taku-ai-implementation-guide.md.

OBJECTIVE:
Implement the Chat Interface component with full TypeScript typing, Tauri IPC integration, and UI component scaffolding.

TASK SPECIFICATION:
1. Install UI framework dependencies:
   - shadcn/ui component library
   - Prompt-Kit for prompt management
   - Execute: npm install required packages

2. Create React components:
   - Create src/components/ChatInterface.tsx with:
     * React functional component (TypeScript)
     * Message display container with scroll behavior
     * User input textarea with send functionality
     * Error boundary and loading states
     * Props interface and type definitions
   
   - Create src/lib/api.ts with:
     * Tauri IPC command wrapper functions
     * Ollama API integration layer
     * Error handling and retry logic
     * TypeScript interfaces for API responses

3. Update application layout:
   - Modify src/App.tsx to integrate ChatInterface
   - Implement proper layout hierarchy
   - Add CSS modules or Tailwind styling
   - Verify component hot reload works

4. Verify implementation:
   - Run TypeScript compiler with strict mode
   - Verify no linting errors
   - Test component renders correctly
   - Confirm Tauri IPC commands are accessible

EXECUTION REQUIREMENTS:
- Generate code following TypeScript strict mode requirements
- Implement error boundaries and proper exception handling
- Follow component specification in implementation-guide.md exactly
- Verify zero TypeScript compilation errors
- Confirm hot reload reflects component changes
- Log generated file paths and line counts
- Test component integration with main application

PROCEED WITH CHAT INTERFACE COMPONENT IMPLEMENTATION.
```

---

## PROMPT DESIGN PRINCIPLES

**Structure:**
- CONTEXT: Current state, resources, constraints
- AVAILABLE REFERENCES: Documentation to consult
- OBJECTIVE: Clear, measurable outcome
- TASK SPECIFICATION: Step-by-step implementation
- EXECUTION REQUIREMENTS: Success criteria and validation
- ACTION DIRECTIVE: Explicit instruction to proceed

**Communication Standards:**
- Technical, professional terminology
- Measurable success criteria
- Structured task decomposition
- Error handling specifications
- Verification and validation steps
- Explicit completion requirements

---

## EXECUTION SEQUENCE

**Phase 1: Infrastructure Setup**
- PROMPT 1: Tauri project initialization
- PROMPT 2: Dependency installation
- PROMPT 3: AI model configuration

**Phase 2: Project Foundation**
- PROMPT 4: Configuration and version control
- PROMPT 5: Development environment validation

**Phase 3: Feature Implementation**
- PROMPT 6: Chat Interface component

Each phase includes completion verification before proceeding to next.

---

## USAGE INSTRUCTIONS

1. Copy entire prompt block
2. Paste into Antigravity Agent panel
3. Agent executes with terminal access
4. Await completion report
5. Proceed to next prompt when ready

Agent operates autonomously within specification. No manual intervention required between prompts.
