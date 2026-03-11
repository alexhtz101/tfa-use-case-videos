import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, Target, Shuffle, MessageSquare, Compass, Wrench, Focus, Grid3X3, RotateCw, CheckCircle, XCircle, AlertCircle, Calculator, TrendingUp, Send, Loader2, Sparkles, ClipboardList, MessageCircle, HelpCircle, Shield, Layers, Eye, Play, Info, BookOpen, Home, ExternalLink, ArrowRight, FlaskConical, Microscope, LineChart, Beaker, Atom, Lightbulb } from 'lucide-react';
import './App.css';

// ============================================
// LANDING PAGE COMPONENT
// ============================================
function LandingPage({ onSelectMath, onSelectScience }) {
  const subjects = [
    {
      id: 'ela',
      name: 'ELA',
      description: 'English Language Arts framework for integrating AI into secondary ELA core instruction while preserving rigor and student agency.',
      icon: BookOpen,
      status: 'available',
      external: true,
      url: 'https://hqim.ai/#overview'
    },
    {
      id: 'math',
      name: 'Math',
      description: 'A framework for productive AI use in mathematics instruction.',
      icon: Layers,
      status: 'beta',
      external: false
    },
    {
      id: 'science',
      name: 'Science',
      description: 'A framework for AI integration in science classrooms — supporting inquiry-based learning and scientific reasoning.',
      icon: Compass,
      status: 'beta',
      external: false
    },
    {
      id: 'history',
      name: 'History',
      description: 'A framework for AI use in history and social studies — preserving critical analysis of sources and historical thinking.',
      icon: ClipboardList,
      status: 'coming',
      external: false
    }
  ];

  return (
    <div className="landing-container">
      {/* Header */}
      <section className="landing-header">
        <h1 className="landing-title">Explore the Frameworks</h1>
        <p className="landing-subtitle">Practical frameworks for integrating AI into K-12 instruction</p>
      </section>

      {/* Subject Cards Grid */}
      <section className="frameworks-grid">
        {subjects.map((subject) => {
          const IconComponent = subject.icon;
          const isClickable = subject.status === 'available' || subject.status === 'beta';
          const isAvailable = subject.status === 'available';

          return (
            <div
              key={subject.id}
              className={`framework-card ${subject.status === 'coming' ? 'coming-soon' : ''}`}
              onClick={() => {
                if (isClickable) {
                  if (subject.external) {
                    window.open(subject.url, '_blank');
                  } else if (subject.id === 'math') {
                    onSelectMath();
                  } else if (subject.id === 'science') {
                    onSelectScience();
                  }
                }
              }}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              <span className={`framework-badge ${subject.status}`}>
                {isAvailable ? 'AVAILABLE NOW' : subject.status === 'beta' ? 'BETA' : 'COMING SOON'}
              </span>

              <div className={`framework-icon ${isClickable ? 'active' : ''}`}>
                <IconComponent size={28} />
              </div>

              <h3 className="framework-name">{subject.name}</h3>
              <p className="framework-description">{subject.description}</p>

              {isClickable && (
                <a className="framework-link">
                  Explore <ChevronRight size={16} />
                </a>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

// ============================================
// AI EXTENSION PRINCIPLES
// ============================================
const aiExtensionPrinciples = [
  {
    id: 'socratic',
    name: 'Socratic Questioning',
    shortName: 'Socratic',
    definition: 'AI asks probing questions that help students examine their reasoning, surface assumptions, and deepen understanding.',
    icon: HelpCircle,
    color: 'blue',
    tier: 'uphold',
    level: 1
  },
  {
    id: 'resistance',
    name: 'Productive Resistance',
    shortName: 'Resistance',
    definition: 'AI provides counterarguments, alternative perspectives, or skeptical pushback that students must address and defend against.',
    icon: Shield,
    color: 'orange',
    tier: 'uphold',
    level: 3
  },
  {
    id: 'complexity',
    name: 'Complexity Injection',
    shortName: 'Complexity',
    definition: 'AI introduces complicating factors, edge cases, or unconsidered dimensions that deepen engagement within the original task scope.',
    icon: Layers,
    color: 'purple',
    tier: 'uphold',
    level: 4
  },
  {
    id: 'mirroring',
    name: 'Reflective Mirroring',
    shortName: 'Mirroring',
    definition: 'AI summarizes, restates, or makes explicit what students have produced so they can evaluate their own thinking.',
    icon: Eye,
    color: 'teal',
    tier: 'neutral'
  },
  {
    id: 'simulation',
    name: 'Outcome Simulation',
    shortName: 'Simulation',
    definition: 'AI models what happens when student proposals are implemented, generating results that require interpretation.',
    icon: Play,
    color: 'green',
    tier: 'uphold',
    level: 2
  },
  {
    id: 'information',
    name: 'Strategic Information Provision',
    shortName: 'Information',
    definition: 'AI provides reference information, terminology, or structural options without performing the reasoning or analysis.',
    icon: Info,
    color: 'indigo',
    tier: 'neutral'
  },
  {
    id: 'feedback',
    name: 'Constructive Feedback',
    shortName: 'Feedback',
    definition: 'AI identifies gaps, weaknesses, or inconsistencies in student work without providing the solutions or fixes.',
    icon: MessageSquare,
    color: 'rose',
    tier: 'neutral'
  }
];

// Helper to get principle by ID
const getPrinciple = (id) => aiExtensionPrinciples.find(p => p.id === id);

// ============================================
// LESSON DESIGNER COMPONENT
// ============================================
const LessonDesigner = ({ skillsData }) => {
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [lessonInputs, setLessonInputs] = useState({
    lessonContext: ''
  });
  const [selectedMoves, setSelectedMoves] = useState([]);
  const [expandedPrinciples, setExpandedPrinciples] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutputs, setGeneratedOutputs] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const selectedSkill = skillsData.find(s => s.id === parseInt(selectedSkillId));

  const getMovesForSkill = (skill) => {
    if (!skill) return { neutral: {}, uphold: {} };

    const neutral = {};
    const uphold = {};

    Object.entries(skill.aiExtension.upholdRigor).forEach(([principleId, principleMoves]) => {
      const principle = aiExtensionPrinciples.find(p => p.id === principleId);
      if (!principle) return;

      const movesWithMeta = principleMoves.map((move, idx) => ({
        ...move,
        principleId,
        principleName: principle.name,
        uniqueKey: `${principleId}-${idx}`
      }));

      if (principle.tier === 'neutral') {
        neutral[principleId] = movesWithMeta;
      } else if (principle.tier === 'uphold') {
        uphold[principleId] = movesWithMeta;
      }
    });

    return { neutral, uphold };
  };

  const togglePrincipleExpanded = (principleId) => {
    setExpandedPrinciples(prev => ({
      ...prev,
      [principleId]: !prev[principleId]
    }));
  };

  const handleSkillChange = (e) => {
    setSelectedSkillId(e.target.value);
    setSelectedMoves([]);
    setExpandedPrinciples({});
    setGeneratedOutputs(null);
  };

  const handleInputChange = (field, value) => {
    setLessonInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleMoveToggle = (moveKey) => {
    setSelectedMoves(prev =>
      prev.includes(moveKey)
        ? prev.filter(k => k !== moveKey)
        : [...prev, moveKey]
    );
  };

  const generateOutputs = async () => {
    if (!selectedSkill || selectedMoves.length === 0) return;

    setIsGenerating(true);
    setGeneratedOutputs(null);

    const { neutral, uphold } = getMovesForSkill(selectedSkill);
    const allMoves = [...Object.values(neutral).flat(), ...Object.values(uphold).flat()];
    const selectedMoveDetails = allMoves.filter(m => selectedMoves.includes(m.uniqueKey));

    const prompt = `You are an expert Mathematics instructional coach helping teachers design AI-enhanced lessons using the Human-AI-Human (HAH) Cycle framework aligned with the Standards for Mathematical Practice.

CONTEXT:
- Practice Focus: ${selectedSkill.title}
- Practice Description: ${selectedSkill.description}

LESSON CONTEXT PROVIDED BY TEACHER:
${lessonInputs.lessonContext || 'No specific context provided'}

SELECTED AI MOVES THAT UPHOLD RIGOR:
${selectedMoveDetails.map((m, i) => `${i + 1}. [${m.principleName}] ${m.move}\n   Sample prompt: ${m.prompt}`).join('\n\n')}

TASK: Generate two outputs formatted as plain text (no markdown symbols like **, ##, or bullets). Use clear section headings and line breaks for readability.

OUTPUT 1: CONTEXTUALIZED STUDENT DIRECTIONS

For each selected AI move, write explicit directions a teacher can give students. These should:
- Be specific to the mathematical problem, concept, or task described
- Include example prompts students could use with AI (adapted from the samples above)
- Include a boundary statement that keeps the cognitive work with the student
- Explain what students should do with the AI's response
- Be written in clear, student-friendly language
- Emphasize that the AI asks questions—students provide the mathematical thinking

Format each direction with:
- A clear heading (the move name)
- A short paragraph of directions
- An example prompt in quotes
- A boundary statement labeled "Important"
- What to do after labeled "Next Step"

OUTPUT 2: EVIDENCE OF THINKING RUBRIC

Create a simple 3-level rubric (Developing, Proficient, Advanced) for evaluating student AI engagement artifacts. The rubric should assess:
- Quality of student's initial mathematical reasoning (before AI)
- Quality of student engagement during AI conversation
- Quality of student's revised solution/explanation (after AI)
- Evidence that the student—not the AI—did the mathematical reasoning

IMPORTANT: Format the rubric as an HTML table that can be copied into a document. Use this exact structure:
<table border="1" cellpadding="8" cellspacing="0">
<tr><th>Criteria</th><th>Developing</th><th>Proficient</th><th>Advanced</th></tr>
<tr><td>[Criteria name]</td><td>[Description]</td><td>[Description]</td><td>[Description]</td></tr>
</table>

Be specific and practical. Use the details from the teacher's lesson context (problem type, mathematical concept, student work) in your examples. Do not use markdown formatting like ** or ## anywhere in your response.`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      let content = data.content || data.error || "Error generating response.";

      content = content
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/^##\s+(.+)$/gm, '<strong>$1</strong>')
        .replace(/^###\s+(.+)$/gm, '<strong>$1</strong>')
        .replace(/^\*\s+/gm, '• ')
        .replace(/^-\s+/gm, '• ');

      setGeneratedOutputs(content);
    } catch (error) {
      setGeneratedOutputs("Error: Unable to generate outputs. Please try again.");
    }

    setIsGenerating(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatLoading(true);

    const contextSummary = `
LESSON CONTEXT:
- Practice: ${selectedSkill?.title || 'Not selected'}
- Teacher's Lesson Description: ${lessonInputs.lessonContext || 'Not provided'}

GENERATED OUTPUTS SO FAR:
${generatedOutputs || 'None yet'}
`;

    const systemContext = `You are an expert Mathematics instructional coach and thought partner. You're helping a teacher design an AI-enhanced lesson using the Human-AI-Human (HAH) Cycle framework aligned with the Standards for Mathematical Practice.

${contextSummary}

Be helpful, specific, and practical. If the teacher asks for modifications, provide them. If they have questions about implementation, give concrete advice. Keep responses focused and actionable.`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemContext,
          messages: [...chatMessages, { role: 'user', content: userMessage }]
        })
      });

      const data = await response.json();
      const assistantMessage = data.content || "Error getting response.";
      setChatMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Error: Unable to get response. Please try again." }]);
    }

    setIsChatLoading(false);
  };

  const { neutral: neutralMoves, uphold: upholdMoves } = getMovesForSkill(selectedSkill);
  const allSelectableMoves = [...Object.values(neutralMoves).flat(), ...Object.values(upholdMoves).flat()];

  const renderPrincipleDropdown = (principleId, moves, tierColor) => {
    const principle = aiExtensionPrinciples.find(p => p.id === principleId);
    if (!principle || moves.length === 0) return null;

    const Icon = principle.icon;
    const isExpanded = expandedPrinciples[principleId];
    const selectedCount = moves.filter(m => selectedMoves.includes(m.uniqueKey)).length;

    const colorStyles = {
      amber: {
        bg: '#fef3c7',
        border: '#fbbf24',
        iconColor: '#d97706',
        selectedBg: '#fef3c7',
        selectedBorder: '#fbbf24'
      },
      green: {
        bg: '#d1fae5',
        border: '#10b981',
        iconColor: '#059669',
        selectedBg: '#d1fae5',
        selectedBorder: '#10b981'
      }
    };
    const styles = colorStyles[tierColor] || colorStyles.green;

    return (
      <div key={principleId} className="principle-dropdown" style={{ border: `1px solid ${styles.border}`, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.5rem' }}>
        <button
          onClick={() => togglePrincipleExpanded(principleId)}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            background: styles.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.15s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Icon size={20} style={{ color: styles.iconColor }} />
            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{principle.name}</span>
            {selectedCount > 0 && (
              <span style={{
                marginLeft: '0.5rem',
                padding: '0.2rem 0.5rem',
                background: 'rgba(0,0,0,0.1)',
                fontSize: '0.7rem',
                borderRadius: '999px',
                fontWeight: 600
              }}>
                {selectedCount} selected
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{moves.length} moves</span>
            {isExpanded ? (
              <ChevronDown size={18} style={{ color: 'var(--color-text-muted)' }} />
            ) : (
              <ChevronRight size={18} style={{ color: 'var(--color-text-muted)' }} />
            )}
          </div>
        </button>

        {isExpanded && (
          <div style={{ padding: '1rem', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-subtle)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>{principle.definition}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {moves.map(move => (
                <label
                  key={move.uniqueKey}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${selectedMoves.includes(move.uniqueKey) ? styles.selectedBorder : 'var(--color-border)'}`,
                    background: selectedMoves.includes(move.uniqueKey) ? styles.selectedBg : 'var(--color-bg)',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedMoves.includes(move.uniqueKey)}
                    onChange={() => handleMoveToggle(move.uniqueKey)}
                    style={{ marginTop: '0.2rem' }}
                  />
                  <div>
                    <p style={{ fontWeight: 500, color: 'var(--color-text)', fontSize: '0.9rem' }}>{move.move}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', marginTop: '0.25rem' }}>{move.prompt}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="lesson-designer">
      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className="progress-steps">
          <div className={`progress-step ${selectedSkillId ? 'completed' : 'active'}`}>
            <div className="progress-step-number">1</div>
            <div className="progress-step-label">Practice</div>
          </div>
          <div className="progress-line"><div className={`progress-line-fill ${selectedSkillId ? 'filled' : ''}`}></div></div>
          <div className={`progress-step ${lessonInputs.lessonContext ? 'completed' : selectedSkillId ? 'active' : ''}`}>
            <div className="progress-step-number">2</div>
            <div className="progress-step-label">Context</div>
          </div>
          <div className="progress-line"><div className={`progress-line-fill ${lessonInputs.lessonContext ? 'filled' : ''}`}></div></div>
          <div className={`progress-step ${selectedMoves.length > 0 ? 'completed' : lessonInputs.lessonContext ? 'active' : ''}`}>
            <div className="progress-step-number">3</div>
            <div className="progress-step-label">AI Moves</div>
          </div>
          <div className="progress-line"><div className={`progress-line-fill ${selectedMoves.length > 0 ? 'filled' : ''}`}></div></div>
          <div className={`progress-step ${generatedOutputs ? 'completed' : selectedMoves.length > 0 ? 'active' : ''}`}>
            <div className="progress-step-number">4</div>
            <div className="progress-step-label">Generate</div>
          </div>
        </div>
      </div>

      {/* Step 1: Select Practice */}
      <section className="designer-section">
        <div className="step-header">
          <span className="step-number" style={{ background: '#23abe1' }}>1</span>
          <h3>Select Standard for Mathematical Practice</h3>
        </div>
        <p className="section-description">What mathematical practice will students engage with?</p>
        <select
          value={selectedSkillId}
          onChange={handleSkillChange}
          className="skill-select"
        >
          <option value="">-- Select a practice --</option>
          {skillsData.map(skill => (
            <option key={skill.id} value={skill.id}>
              {skill.title} ({skill.standards})
            </option>
          ))}
        </select>
        {selectedSkill && (
          <p className="skill-description">{selectedSkill.description}</p>
        )}
      </section>

      {/* Step 2: Lesson Context */}
      <section className="designer-section">
        <div className="step-header">
          <span className="step-number" style={{ background: '#23abe1' }}>2</span>
          <h3>Provide Lesson Context</h3>
        </div>
        <p className="section-description">
          Describe your lesson including grade level, mathematical topic, specific problem, and what students have already learned.
        </p>
        <textarea
          placeholder="e.g., Algebra 1 students are working on systems of equations using the Illustrative Mathematics curriculum. Today's task asks them to determine how many adult and child tickets were sold..."
          value={lessonInputs.lessonContext}
          onChange={(e) => handleInputChange('lessonContext', e.target.value)}
          rows={6}
          className="context-textarea"
        />
      </section>

      {/* Step 3: Select AI Moves */}
      <section className="designer-section" style={{ opacity: selectedSkill ? 1 : 0.5 }}>
        <div className="step-header">
          <span className="step-number" style={{ background: '#23abe1' }}>3</span>
          <h3>Select AI Moves</h3>
        </div>
        <p className="section-description">Select moves from the Neutral and Uphold Rigor tiers that fit this practice.</p>

        {!selectedSkill ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
            <p>Please select a Standard for Mathematical Practice above to see available AI moves.</p>
          </div>
        ) : (
          <>

          {/* Neutral Tier */}
          <div className="tier-block">
            <div className="tier-block-header">
              <span className="tier-dot neutral"></span>
              <span className="tier-block-label neutral">Neutral — AI Provides, Student Decides</span>
            </div>
            <div className="principles-list">
              {aiExtensionPrinciples.filter(p => p.tier === 'neutral').map(principle => {
                const moves = neutralMoves[principle.id];
                if (!moves || moves.length === 0) return null;
                return renderPrincipleDropdown(principle.id, moves, 'amber');
              })}
            </div>
          </div>

          {/* Uphold Rigor Tier */}
          <div className="tier-block">
            <div className="tier-block-header">
              <span className="tier-dot uphold"></span>
              <span className="tier-block-label uphold">Uphold Rigor — AI Creates Thinking Conditions</span>
            </div>
            <div className="principles-list">
              {aiExtensionPrinciples.filter(p => p.tier === 'uphold').map(principle => {
                const moves = upholdMoves[principle.id];
                if (!moves || moves.length === 0) return null;
                return renderPrincipleDropdown(principle.id, moves, 'green');
              })}
            </div>
          </div>

          {selectedMoves.length > 0 && (
            <div className="selection-summary">
              <p>
                <strong>{selectedMoves.length} move{selectedMoves.length !== 1 ? 's' : ''} selected</strong> across {
                  [...new Set(allSelectableMoves.filter(m => selectedMoves.includes(m.uniqueKey)).map(m => m.principleId))].length
                } principle{[...new Set(allSelectableMoves.filter(m => selectedMoves.includes(m.uniqueKey)).map(m => m.principleId))].length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          <div className="generate-section" style={{ marginTop: '1.5rem' }}>
            <button
              onClick={generateOutputs}
              disabled={selectedMoves.length === 0 || isGenerating}
              className="generate-button"
              style={{ background: selectedMoves.length === 0 || isGenerating ? '#d1d5db' : '#23abe1' }}
            >
              {isGenerating ? (
                <span className="generating-state">
                  <span><Loader2 className="animate-spin" size={20} /> Generating...</span>
                  <span className="generating-note">This may take up to 30 seconds</span>
                </span>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Lesson Materials
                </>
              )}
            </button>
          </div>
        </>
        )}
      </section>

      {/* Generated Outputs */}
      {generatedOutputs && (
        <section className="designer-section">
          <div className="section-header">
            <div className="section-icon success">
              <CheckCircle size={20} />
            </div>
            <h3>Generated Outputs</h3>
          </div>
          <div className="output-content" dangerouslySetInnerHTML={{ __html: generatedOutputs }} />
        </section>
      )}

      {/* Chat Interface */}
      {generatedOutputs && (
        <section className="designer-section">
          <div className="section-header">
            <div className="section-icon chat">
              <MessageCircle size={20} />
            </div>
              <h3>Thought Partnership</h3>
          </div>
          <p className="section-description">
            Have questions? Want modifications? Use this chat to refine your lesson design.
          </p>

          <div className="bg-gray-50 rounded-lg border border-gray-200 h-64 overflow-y-auto mb-4 p-4">
            {chatMessages.length === 0 ? (
              <p className="text-gray-400 text-center mt-8">
                Ask questions about implementation, request modifications, or explore alternatives...
              </p>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-violet-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <Loader2 className="animate-spin text-gray-400" size={20} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Ask a question or request modifications..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
            <button
              onClick={sendChatMessage}
              disabled={!chatInput.trim() || isChatLoading}
              className={`px-4 rounded-lg transition-colors ${
                !chatInput.trim() || isChatLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-violet-600 text-white hover:bg-violet-700'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

// ============================================
// SKILLS DATA
// ============================================
const skillsData = [
  {
    id: 1,
    title: "Make Sense of Problems & Persevere",
    standards: "SMP-1",
    icon: Target,
    description: "Mathematically proficient students start by explaining the meaning of a problem and looking for entry points. They analyze givens, constraints, and relationships, and they monitor and evaluate their progress, changing course if necessary.",
    humanLift: [
      { step: "Restate the Problem", detail: "Put the problem in your own words—what are you trying to find or show?" },
      { step: "Identify Givens and Unknowns", detail: "List what information you have and what you need to find." },
      { step: "Consider Entry Points", detail: "Think of multiple ways you might approach the problem." },
      { step: "Make a Plan", detail: "Choose a strategy and outline your approach before calculating." },
      { step: "Monitor Progress", detail: "Check periodically—is your approach working? Do you need to adjust?" }
    ],
    aiExtension: {
      role: "Problem Clarifier",
      description: "AI helps students make sense of problems by asking clarifying questions—but does not solve or suggest strategies.",
      upholdRigor: {
        socratic: [
          { move: "Ask what the problem is really asking", prompt: '"Here\'s the problem I\'m working on. Ask me questions that help me understand what it\'s really asking."' },
          { move: "Probe for understanding of key terms", prompt: '"I think I understand the terms in this problem. Ask me questions to check if I really know what they mean."' },
          { move: "Question entry point choices", prompt: '"I\'m thinking of starting by [approach]. Ask me questions about why this is a good entry point."' }
        ],
        resistance: [
          { move: "Challenge assumptions about constraints", prompt: '"Here\'s my interpretation of the constraints. Challenge my assumptions—am I missing anything?"' },
          { move: "Push back on problem restatement", prompt: '"I restated the problem as [restatement]. Push back—is my restatement accurate and complete?"' },
          { move: "Question whether all information is needed", prompt: '"I think I need all this information to solve the problem. Challenge me—is any of it unnecessary or distracting?"' }
        ],
        complexity: [
          { move: "Introduce edge cases to consider", prompt: '"Ask me what would happen in edge cases—what if a value is zero, negative, or very large?"' },
          { move: "Add constraints to stress-test understanding", prompt: '"What if there were an additional constraint? Ask me how that would change my approach."' },
          { move: "Explore multiple solution paths", prompt: '"I have one approach in mind. Ask me questions about other approaches I haven\'t considered."' }
        ],
        mirroring: [
          { move: "Reflect back problem interpretation", prompt: '"Summarize what you hear me saying about this problem. Does my understanding sound complete?"' },
          { move: "Surface implicit assumptions", prompt: '"What assumptions am I making about this problem that I haven\'t stated? Reflect them back to me."' },
          { move: "Explore what makes this problem hard", prompt: '"I\'m stuck. Ask me questions that help me figure out what specifically is making this difficult."' }
        ],
        simulation: [
          { move: "Ask what a solution would look like", prompt: '"Before I solve, ask me questions about what form my answer should take and how I\'ll know if it\'s right."' },
          { move: "Test understanding with simple case", prompt: '"If I try a simple example first, what should happen? Walk me through checking my understanding."' },
          { move: "Project what happens if approach fails", prompt: '"What if my current approach doesn\'t work? Ask me questions about how I\'ll know to change course."' }
        ],
        information: [
          { move: "Clarify problem type", prompt: '"What type of problem is this (optimization, proof, modeling)? Help me name it without telling me how to solve it."' },
          { move: "Identify relevant mathematical domains", prompt: '"What areas of math might be relevant here? Help me see connections without giving away the solution."' },
          { move: "Explain problem-solving heuristics", prompt: '"What general problem-solving strategies exist for problems like this? List them without telling me which to use."' }
        ],
        feedback: [
          { move: "Identify gaps in problem understanding", prompt: '"Based on my restatement, what aspects of the problem have I not addressed?"' },
          { move: "Flag unclear reasoning", prompt: '"Where is my understanding of this problem weakest? Point to gaps without filling them."' },
          { move: "Note missing considerations", prompt: '"What questions should I be asking myself about this problem that I haven\'t asked yet?"' }
        ]
      },
      collapseRigor: [
        { move: "Solving any part of the problem", prompt: '"Can you solve the first step for me so I can see how to start?"' },
        { move: "Suggesting solution strategies", prompt: '"What method should I use to solve this?"' },
        { move: "Identifying the key insight for the student", prompt: '"What\'s the trick to this problem?"' },
        { move: "Simplifying the problem to make it easier", prompt: '"This is too hard. Can you give me an easier version?"' }
      ]
    },
    returnToHuman: {
      task: "Revise Your Problem Interpretation",
      description: "Based on the AI conversation, refine your understanding of the problem. Document what you now see differently—constraints you missed, quantities you misidentified, or approaches you hadn't considered. Then execute your chosen strategy, showing your work.",
      criteria: [
        "Revised problem restatement reflecting deeper understanding",
        "Explicit identification of what changed in your thinking",
        "Clear rationale for your chosen solution approach"
      ]
    },
    evidence: {
      artifacts: [
        "Initial problem restatement (BEFORE AI)",
        "Chat transcript showing problem exploration",
        "Revised interpretation with annotations",
        "Solution work showing chosen approach"
      ],
      reflection: "What did you understand differently about the problem after the AI conversation? How did that change your approach?"
    }
  },
  {
    id: 2,
    title: "Reason Abstractly & Quantitatively",
    standards: "SMP-2",
    icon: Shuffle,
    description: "Students make sense of quantities and their relationships. They decontextualize (abstract from context) and contextualize (probe into the meaning of numbers and symbols), attending to the meaning of quantities throughout problem solving.",
    humanLift: [
      { step: "Identify Quantities", detail: "Name all the quantities in the problem and their units." },
      { step: "Represent Symbolically", detail: "Translate the situation into mathematical symbols and expressions." },
      { step: "Manipulate Symbols", detail: "Work with the mathematical representation, tracking meaning." },
      { step: "Interpret Results", detail: "Connect your answer back to the original context—what does it mean?" },
      { step: "Check Reasonableness", detail: "Does your answer make sense in the real-world context?" }
    ],
    aiExtension: {
      role: "Context Connector",
      description: "AI challenges students to connect symbols to meaning and meaning to symbols—but does not perform translations.",
      upholdRigor: {
        socratic: [
          { move: "Ask what symbols represent in context", prompt: '"I wrote this equation to represent the situation. Ask me questions about what each part means in context."' },
          { move: "Probe for unit awareness", prompt: '"Ask me questions about the units in my calculation—help me make sure I\'m tracking them correctly."' },
          { move: "Question meaning of operations", prompt: '"I\'m multiplying these two quantities. Ask me questions about what multiplication means in this context."' }
        ],
        resistance: [
          { move: "Challenge interpretation of results", prompt: '"I got this answer. Ask me questions that help me think about what this number actually means in the problem."' },
          { move: "Question reasonableness of answers", prompt: '"Does my answer make sense? Ask me questions that help me check if it\'s reasonable in this context."' },
          { move: "Push back on symbolic choices", prompt: '"I chose to represent this with variable x. Challenge whether my symbolic representation captures the situation correctly."' }
        ],
        complexity: [
          { move: "Introduce unit complications", prompt: '"What if the units were different? Ask me how I would adjust my representation."' },
          { move: "Add contextual constraints", prompt: '"What real-world constraints should limit my answer? Help me think about what values make sense."' },
          { move: "Explore boundary cases", prompt: '"What happens at the extremes? Ask me about what my equation predicts when values are very large or very small."' }
        ],
        mirroring: [
          { move: "Explore what quantities mean in the situation", prompt: '"I can do the math, but I\'m not sure what the numbers mean. Ask me questions that help me connect symbols to the situation."' },
          { move: "Reflect back the translation process", prompt: '"Walk me through how I went from words to symbols. Does my process sound logical when you say it back?"' },
          { move: "Surface implicit quantity relationships", prompt: '"What relationships between quantities am I assuming? Reflect back what you hear me saying."' }
        ],
        simulation: [
          { move: "Test interpretation with specific values", prompt: '"Let me plug in specific numbers. Ask me questions about whether the result makes sense in the real situation."' },
          { move: "Project what equation predicts", prompt: '"According to my equation, what should happen if I double this quantity? Help me check if that matches reality."' },
          { move: "Model extreme scenarios", prompt: '"What does my model predict in extreme cases? Ask me if those predictions are realistic."' }
        ],
        information: [
          { move: "Clarify quantity types", prompt: '"What type of quantity is this (rate, ratio, absolute amount)? Help me name it correctly."' },
          { move: "Identify standard representations", prompt: '"How do mathematicians typically represent this type of relationship? Show me conventions without solving for me."' },
          { move: "Explain dimensional analysis basics", prompt: '"How does dimensional analysis work? Explain the concept so I can apply it myself."' }
        ],
        feedback: [
          { move: "Identify decontextualization gaps", prompt: '"Where have I lost track of context in my symbolic work? Point to where meaning got lost."' },
          { move: "Flag unit inconsistencies", prompt: '"Where are my units not matching up? Identify the problem without fixing it for me."' },
          { move: "Note missing quantity relationships", prompt: '"What relationships between quantities have I not represented? Point to gaps in my model."' }
        ]
      },
      collapseRigor: [
        { move: "Translating context to symbols for the student", prompt: '"Can you write the equation for this word problem?"' },
        { move: "Interpreting results for the student", prompt: '"What does my answer of 42 mean in this problem?"' },
        { move: "Checking units for the student", prompt: '"Are my units right?"' },
        { move: "Telling student if answer is reasonable", prompt: '"Is 500 a reasonable answer for this problem?"' }
      ]
    },
    returnToHuman: {
      task: "Connect Your Mathematics to Context",
      description: "After the AI conversation, write a complete interpretation that explicitly connects every symbol, operation, and result to the original situation. Verify that your answer is reasonable given the real-world context and explain what the numbers actually mean.",
      criteria: [
        "Every variable and symbol explained in context",
        "Final answer interpreted in real-world terms",
        "Reasonableness check with explicit justification"
      ]
    },
    evidence: {
      artifacts: [
        "Initial symbolic work with annotations (BEFORE AI)",
        "Chat transcript showing meaning-making discussion",
        "Final solution with complete contextual interpretation"
      ],
      reflection: "Where did you lose track of meaning during your calculation? How did you reconnect the math to the context?"
    }
  },
  {
    id: 3,
    title: "Construct Viable Arguments & Critique Reasoning",
    standards: "SMP-3",
    icon: MessageSquare,
    description: "Students understand and use assumptions, definitions, and established results. They justify conclusions, communicate them to others, and respond to the arguments of others by listening, asking clarifying questions, and critiquing reasoning.",
    humanLift: [
      { step: "State Your Claim", detail: "Clearly articulate what you believe to be true mathematically." },
      { step: "Build the Argument", detail: "Use definitions, properties, and prior results to support your claim." },
      { step: "Explain the Logic", detail: "Show how each step follows from the previous one." },
      { step: "Anticipate Objections", detail: "Consider what someone might challenge in your argument." },
      { step: "Evaluate Others' Reasoning", detail: "Analyze arguments for validity and identify errors or gaps." }
    ],
    aiExtension: {
      role: "Argument Challenger",
      description: "AI acts as a skeptical peer, questioning mathematical arguments—but does not construct or fix arguments.",
      upholdRigor: {
        socratic: [
          { move: "Question use of definitions", prompt: '"I\'m using this definition in my proof. Ask me questions about whether I\'m applying it correctly."' },
          { move: "Probe for hidden assumptions", prompt: '"I\'m trying to prove this statement. Ask me questions about what I\'m assuming that I haven\'t stated."' },
          { move: "Examine claim precision", prompt: '"Here\'s my claim. Ask me questions about whether it\'s stated precisely enough to prove."' }
        ],
        resistance: [
          { move: "Challenge logical leaps", prompt: '"Here\'s my mathematical argument. Act like a skeptical classmate and ask me to justify each step."' },
          { move: "Ask for justification of each step", prompt: '"Challenge each step of my reasoning. For each one, ask me: why is that true?"' },
          { move: "Demand explicit warrants", prompt: '"I say this step follows from the previous one. Push back—make me cite exactly which property or theorem I\'m using."' }
        ],
        complexity: [
          { move: "Present alternative claims to evaluate", prompt: '"A classmate claims the opposite of what I\'m arguing. Ask me questions that help me address their position."' },
          { move: "Introduce boundary cases", prompt: '"Does my argument work in special cases? Ask me about edge cases where my proof might break down."' },
          { move: "Suggest converse to consider", prompt: '"I proved the forward direction. Ask me questions about whether the converse is also true."' }
        ],
        mirroring: [
          { move: "Restate the logical structure", prompt: '"Summarize the logical structure of my argument. Does it sound valid when you say it back?"' },
          { move: "Surface implicit reasoning", prompt: '"What logical moves am I making that I haven\'t said out loud? Reflect back the hidden steps."' },
          { move: "Reveal argument form", prompt: '"What form of argument am I using (direct proof, contradiction, induction)? Help me see my own structure."' }
        ],
        simulation: [
          { move: "Test argument with examples", prompt: '"If my argument is correct, what should be true for specific examples? Help me test it."' },
          { move: "Apply reasoning to new case", prompt: '"If my proof technique is valid, it should work for similar claims. Ask me about applying it elsewhere."' },
          { move: "Project counterexample implications", prompt: '"If someone found a counterexample, what would it look like? Help me think through what would break my argument."' }
        ],
        information: [
          { move: "Clarify proof terminology", prompt: '"What is the proper term for this type of proof or argument? Help me use correct mathematical language."' },
          { move: "Identify standard proof techniques", prompt: '"What standard proof techniques exist for this type of claim? List them without telling me which to use."' },
          { move: "Explain logical connectives", prompt: '"I\'m confused about if-then vs. if-and-only-if. Explain the difference so I can use them correctly."' }
        ],
        feedback: [
          { move: "Identify gaps in justification", prompt: '"Where is my argument missing explicit justification? Point to the gaps without filling them."' },
          { move: "Flag circular reasoning", prompt: '"Am I assuming what I\'m trying to prove anywhere? Identify any circular reasoning."' },
          { move: "Note unstated conditions", prompt: '"What conditions does my argument depend on that I haven\'t stated? Point them out."' }
        ]
      },
      collapseRigor: [
        { move: "Constructing arguments for the student", prompt: '"Can you write a proof of this theorem for me?"' },
        { move: "Identifying errors directly", prompt: '"Where did I go wrong in this proof?"' },
        { move: "Providing the justifications", prompt: '"What property justifies this step?"' },
        { move: "Telling student if argument is valid", prompt: '"Is my proof correct?"' }
      ]
    },
    returnToHuman: {
      task: "Strengthen Your Mathematical Argument",
      description: "Based on challenges from the AI conversation, revise your argument to address logical gaps. Add explicit justifications citing mathematical properties, definitions, or prior results. Anticipate and address potential objections in your final argument.",
      criteria: [
        "Each step justified with mathematical reasoning",
        "Logical gaps from AI challenges addressed",
        "Potential counterarguments acknowledged and addressed"
      ]
    },
    evidence: {
      artifacts: [
        "Initial argument or proof (BEFORE AI)",
        "Chat transcript showing argument defense",
        "Revised argument with strengthened justifications"
      ],
      reflection: "What logical gap did the AI conversation reveal? How did you strengthen your argument to address it?"
    }
  },
  {
    id: 4,
    title: "Model with Mathematics",
    standards: "SMP-4",
    icon: Compass,
    description: "Students apply mathematics to solve problems in everyday life. They make assumptions and approximations, identify important quantities, analyze relationships, and evaluate whether results make sense, possibly improving the model.",
    humanLift: [
      { step: "Identify the Real Situation", detail: "Describe the context and what you're trying to understand or predict." },
      { step: "Make Assumptions", detail: "Decide what to include, exclude, or simplify in your model." },
      { step: "Choose Mathematical Tools", detail: "Select equations, graphs, tables, or other representations." },
      { step: "Analyze the Model", detail: "Use the model to answer questions or make predictions." },
      { step: "Validate and Refine", detail: "Check if results make sense; improve the model if needed." }
    ],
    aiExtension: {
      role: "Model Critic",
      description: "AI probes the assumptions and limitations of mathematical models—but does not build models for the student.",
      upholdRigor: {
        socratic: [
          { move: "Ask about excluded factors", prompt: '"I chose to ignore certain factors in my model. Ask me questions that help me think about whether that was a good choice."' },
          { move: "Probe modeling choices", prompt: '"I chose to represent this with [type of function/equation]. Ask me why this representation fits the situation."' },
          { move: "Question variable selection", prompt: '"These are the variables in my model. Ask me questions about whether I\'ve identified the right quantities to track."' }
        ],
        resistance: [
          { move: "Challenge simplifying assumptions", prompt: '"Here\'s my mathematical model. Ask me questions about the assumptions I made and whether they\'re reasonable."' },
          { move: "Question predictions against reality", prompt: '"My model predicts this result. Ask me questions about whether I should trust this prediction."' },
          { move: "Push back on linearity assumptions", prompt: '"I assumed a linear relationship. Challenge me—is that assumption justified for this situation?"' }
        ],
        complexity: [
          { move: "Probe for domain limitations", prompt: '"Ask me questions about when my model works and when it might break down."' },
          { move: "Explore where the model breaks down", prompt: '"How could my model be wrong? Ask me questions that help me find its limitations."' },
          { move: "Introduce complicating factors", prompt: '"What factors did I leave out? Ask me how including them would change my model."' }
        ],
        mirroring: [
          { move: "Reflect back model structure", prompt: '"Summarize what my model is saying about the real situation. Does it sound reasonable when you describe it?"' },
          { move: "Surface implicit assumptions", prompt: '"What assumptions am I making that I haven\'t stated? Reflect back what you hear me taking for granted."' },
          { move: "Articulate model purpose", prompt: '"What question is my model designed to answer? Help me see if I\'m clear on its purpose."' }
        ],
        simulation: [
          { move: "Test model with known cases", prompt: '"Let\'s check my model against cases where I know the answer. Ask me what my model predicts."' },
          { move: "Project model behavior at extremes", prompt: '"What does my model predict for very large or very small values? Help me check if those predictions make sense."' },
          { move: "Explore sensitivity to changes", prompt: '"If I change one input slightly, how much does the output change? Help me understand my model\'s sensitivity."' }
        ],
        information: [
          { move: "Identify model types", prompt: '"What type of model is this (linear, exponential, periodic)? Help me name the category without building it for me."' },
          { move: "Explain modeling cycle", prompt: '"What are the stages of mathematical modeling? Describe the process so I can check where I am."' },
          { move: "Clarify assumption types", prompt: '"What kinds of assumptions do modelers typically make? Help me categorize my own assumptions."' }
        ],
        feedback: [
          { move: "Identify model-reality gaps", prompt: '"Where does my model diverge from what would actually happen? Point to the gaps without fixing them."' },
          { move: "Flag unrealistic predictions", prompt: '"Where does my model make predictions that seem unrealistic? Identify the problems."' },
          { move: "Note missing variables", prompt: '"What important factors have I not included in my model? Point them out without adding them for me."' }
        ]
      },
      collapseRigor: [
        { move: "Suggesting model structures", prompt: '"What kind of model should I use for this situation?"' },
        { move: "Identifying which variables to include", prompt: '"What variables should I include in my model?"' },
        { move: "Building the model for the student", prompt: '"Can you create a model for this real-world scenario?"' },
        { move: "Evaluating model validity for the student", prompt: '"Is my model good enough?"' }
      ]
    },
    returnToHuman: {
      task: "Refine Your Model and Document Limitations",
      description: "Based on the AI conversation, decide whether to revise your model or accept its limitations. Document your assumptions explicitly, explain where the model applies and where it breaks down, and justify why it's appropriate (or not) for this context.",
      criteria: [
        "Assumptions explicitly stated and justified",
        "Model limitations identified and explained",
        "Decision about refinement documented with reasoning"
      ]
    },
    evidence: {
      artifacts: [
        "Initial model with stated assumptions (BEFORE AI)",
        "Chat transcript showing model critique",
        "Final model with limitations documentation"
      ],
      reflection: "What limitation in your model did you discover? How did you decide whether to address it or accept it?"
    }
  },
  {
    id: 5,
    title: "Use Appropriate Tools Strategically",
    standards: "SMP-5",
    icon: Wrench,
    description: "Students consider available tools (including estimation, technology, and manipulatives), are familiar with tools appropriate for their grade, make sound decisions about when each might be helpful, and detect possible errors.",
    humanLift: [
      { step: "Survey Available Tools", detail: "Consider what tools (calculators, graphs, tables, manipulatives) might help." },
      { step: "Evaluate Appropriateness", detail: "Think about which tools are best suited for this specific problem." },
      { step: "Choose Strategically", detail: "Select tools that will be most efficient and revealing." },
      { step: "Use Tools Effectively", detail: "Apply the chosen tools correctly and interpret their outputs." },
      { step: "Verify Results", detail: "Use different tools or methods to check your answer." }
    ],
    aiExtension: {
      role: "Tool Questioner",
      description: "AI challenges tool choices and pushes for strategic thinking about when and why to use tools—but does not select tools.",
      upholdRigor: {
        socratic: [
          { move: "Ask why a particular tool was chosen", prompt: '"I decided to use this tool for this problem. Ask me questions about whether that was a good choice."' },
          { move: "Ask what the tool output means", prompt: '"My graph/calculator gave me this result. Ask me questions that help me interpret what it means."' },
          { move: "Probe tool settings choices", prompt: '"I used these settings/window on my graphing tool. Ask me questions about whether those choices were appropriate."' }
        ],
        resistance: [
          { move: "Challenge whether a tool is appropriate", prompt: '"Ask me questions that help me think about whether a calculator or by-hand calculation is better here."' },
          { move: "Question reliance on technology", prompt: '"I\'m using technology for this step. Push back—could I have done this more efficiently by hand?"' },
          { move: "Challenge tool over-dependence", prompt: '"Am I using a tool as a crutch? Ask me if I understand what the tool is doing mathematically."' }
        ],
        complexity: [
          { move: "Probe for tool limitations", prompt: '"Ask me questions about what my chosen tool can and can\'t do for this problem."' },
          { move: "Explore alternative tool options", prompt: '"Ask me questions about what other tools I considered and why I didn\'t use them."' },
          { move: "Introduce tool failure scenarios", prompt: '"What if your tool gives a wrong or misleading result? Ask me how I would detect that."' }
        ],
        mirroring: [
          { move: "Reflect back tool strategy", prompt: '"Summarize my tool selection process. Does my reasoning sound strategic when you say it back?"' },
          { move: "Surface tool assumptions", prompt: '"What am I assuming about what my tool can do? Reflect back assumptions I might not realize I\'m making."' },
          { move: "Articulate tool purpose", prompt: '"Why am I using a tool at all for this problem? Help me articulate my reasoning."' }
        ],
        simulation: [
          { move: "Test tool output reasonableness", prompt: '"My tool gave me this answer. Help me think through whether it makes sense before I trust it."' },
          { move: "Compare tool methods", prompt: '"If I used a different tool, would I get the same answer? Help me think about verification."' },
          { move: "Project tool limitations", prompt: '"What would happen if I applied this tool to a harder version of this problem? Would it still work?"' }
        ],
        information: [
          { move: "Identify tool categories", prompt: '"What types of mathematical tools exist for this kind of problem? List categories without recommending one."' },
          { move: "Explain tool conventions", prompt: '"What conventions does this tool use that I need to understand? Explain without doing the work for me."' },
          { move: "Clarify tool capabilities", prompt: '"What can this type of tool do mathematically? Help me understand its capabilities."' }
        ],
        feedback: [
          { move: "Identify tool misuse", prompt: '"Am I using this tool correctly? Point out potential misuse without fixing it for me."' },
          { move: "Flag interpretation errors", prompt: '"Where might I be misinterpreting my tool\'s output? Identify potential errors."' },
          { move: "Note strategic gaps", prompt: '"Where is my tool strategy weak? Point to gaps in my reasoning about tool use."' }
        ]
      },
      collapseRigor: [
        { move: "Recommending specific tools", prompt: '"What tool should I use to solve this?"' },
        { move: "Using tools for the student", prompt: '"Can you graph this function for me?"' },
        { move: "Interpreting tool output for the student", prompt: '"What does this graph mean?"' },
        { move: "Making the tool decision for the student", prompt: '"Should I use a calculator or do this by hand?"' }
      ]
    },
    returnToHuman: {
      task: "Evaluate and Justify Your Tool Choice",
      description: "After using your chosen tool and completing the problem, evaluate whether your tool choice was appropriate. Document what the tool did well, what limitations you encountered, and what you would do differently next time for similar problems.",
      criteria: [
        "Tool output correctly interpreted",
        "Effectiveness of tool choice evaluated",
        "Lessons learned for future tool selection"
      ]
    },
    evidence: {
      artifacts: [
        "Tool selection rationale (BEFORE AI)",
        "Chat transcript showing tool discussion",
        "Completed work with tool effectiveness reflection"
      ],
      reflection: "Why was your tool choice effective (or not)? What would you do differently next time?"
    }
  },
  {
    id: 6,
    title: "Attend to Precision",
    standards: "SMP-6",
    icon: Focus,
    description: "Students communicate precisely using clear definitions, stating meaning of symbols, specifying units, labeling quantities, and calculating accurately and efficiently with appropriate degree of precision.",
    humanLift: [
      { step: "Define Terms Carefully", detail: "Use mathematical vocabulary correctly and define terms when needed." },
      { step: "Specify Units", detail: "Include units in calculations and answers; convert when necessary." },
      { step: "Label Clearly", detail: "Make clear what symbols and variables represent." },
      { step: "Calculate Accurately", detail: "Perform calculations carefully, checking for errors." },
      { step: "Choose Appropriate Precision", detail: "Round or express answers with precision appropriate to the context." }
    ],
    aiExtension: {
      role: "Precision Auditor",
      description: "AI probes for precision in language, notation, and calculation—but does not correct or provide precise statements.",
      upholdRigor: {
        socratic: [
          { move: "Probe for unit consistency", prompt: '"Ask me questions about the units in my calculation—help me check if I\'m tracking them correctly."' },
          { move: "Ask what symbols mean exactly", prompt: '"Ask me questions about what each symbol in my work represents—don\'t assume you know what I mean."' },
          { move: "Question definition usage", prompt: '"I\'m using this mathematical term. Ask me questions about what exactly I mean by it."' }
        ],
        resistance: [
          { move: "Challenge imprecise language", prompt: '"I\'m using this mathematical term in my explanation. Ask me questions that help me make sure I\'m using it correctly."' },
          { move: "Question appropriate precision level", prompt: '"My answer is this number. Ask me questions about whether that level of precision makes sense here."' },
          { move: "Push back on vague claims", prompt: '"I said something is \'big\' or \'small.\' Challenge me to be more mathematically precise."' }
        ],
        complexity: [
          { move: "Introduce precision edge cases", prompt: '"What happens to my precision when values are very large or very small? Help me think about numerical limits."' },
          { move: "Explore rounding implications", prompt: '"If I round at different stages, how does that affect my final answer? Help me think about error propagation."' },
          { move: "Consider significant figures", prompt: '"How do significant figures affect my calculation? Ask me questions about appropriate precision."' }
        ],
        mirroring: [
          { move: "Reflect back mathematical language", prompt: '"Repeat back my mathematical explanation. Does it sound precise and clear when you say it?"' },
          { move: "Surface imprecise statements", prompt: '"Where am I being vague? Reflect back statements that could be interpreted multiple ways."' },
          { move: "Articulate precision choices", prompt: '"Help me see what precision choices I\'ve made—explicitly or implicitly."' }
        ],
        simulation: [
          { move: "Test precision with specific values", prompt: '"If I use my notation with specific numbers, does it work as intended? Help me check."' },
          { move: "Project precision errors", prompt: '"If someone misinterpreted my notation, what mistake might they make? Help me see potential confusion."' },
          { move: "Model precision impact", prompt: '"How would different precision levels change my final answer? Help me understand the impact."' }
        ],
        information: [
          { move: "Clarify notation conventions", prompt: '"What are the standard conventions for writing this mathematically? Show me without fixing my work."' },
          { move: "Explain precision terminology", prompt: '"What\'s the difference between accuracy and precision? Help me use terms correctly."' },
          { move: "Identify standard forms", prompt: '"What are the accepted ways to express this type of answer? List options without choosing for me."' }
        ],
        feedback: [
          { move: "Question unclear notation", prompt: '"Here\'s my solution. Ask me questions about whether my notation is clear and consistent."' },
          { move: "Identify ambiguous expressions", prompt: '"Where could my work be misunderstood? Point to ambiguities without resolving them."' },
          { move: "Flag missing labels", prompt: '"What have I left unlabeled that should be labeled? Point to gaps in my notation."' }
        ]
      },
      collapseRigor: [
        { move: "Correcting errors for the student", prompt: '"Fix the errors in my calculation."' },
        { move: "Providing precise language", prompt: '"What\'s the correct mathematical term for this?"' },
        { move: "Adding units or labels for the student", prompt: '"Add the units to my answer."' },
        { move: "Telling student what precision to use", prompt: '"How many decimal places should my answer have?"' }
      ]
    },
    returnToHuman: {
      task: "Revise for Mathematical Precision",
      description: "Based on the AI conversation, revise your work to improve precision. Correct unclear notation, add missing units, fix imprecise language, and ensure your solution communicates clearly to someone who hasn't seen the original problem.",
      criteria: [
        "All quantities labeled with appropriate units",
        "Mathematical vocabulary used correctly",
        "Notation clear enough for others to follow",
        "Precision level appropriate to context"
      ]
    },
    evidence: {
      artifacts: [
        "Initial work showing notation and language (BEFORE AI)",
        "Chat transcript showing precision discussion",
        "Revised work with precision improvements marked"
      ],
      reflection: "What imprecision did you identify? Why does precision matter for communicating your mathematical thinking?"
    }
  },
  {
    id: 7,
    title: "Look for & Make Use of Structure",
    standards: "SMP-7",
    icon: Grid3X3,
    description: "Students look closely to discern patterns or structure. They recognize the significance of existing features and can shift perspective to see things in different ways, such as seeing complex expressions as composed of simpler ones.",
    humanLift: [
      { step: "Look for Patterns", detail: "Examine the problem for familiar structures, patterns, or relationships." },
      { step: "Decompose Complexity", detail: "Break complex expressions or problems into simpler parts." },
      { step: "Recognize Forms", detail: "Identify when an expression fits a familiar pattern or structure." },
      { step: "Shift Perspective", detail: "Try viewing the problem from different angles or representations." },
      { step: "Leverage Structure", detail: "Use recognized patterns to simplify or solve the problem." }
    ],
    aiExtension: {
      role: "Structure Questioner",
      description: "AI prompts students to notice and articulate structure—but does not identify patterns or structures for them.",
      upholdRigor: {
        socratic: [
          { move: "Ask what patterns the student notices", prompt: '"I\'m looking at this expression. Ask me questions that help me notice any structure or patterns—don\'t point them out."' },
          { move: "Probe for connections to prior problems", prompt: '"This problem feels familiar but I can\'t place it. Ask me questions that help me connect it to things I\'ve seen before."' },
          { move: "Question whether parts have familiar forms", prompt: '"Ask me questions about whether any part of this expression looks like something I\'ve worked with before."' }
        ],
        resistance: [
          { move: "Challenge claimed patterns", prompt: '"I think I see a pattern here. Push back—ask me questions that test whether the pattern is real or coincidental."' },
          { move: "Question structural interpretation", prompt: '"I\'m viewing this expression as [structure]. Challenge whether that\'s the most useful way to see it."' },
          { move: "Push for deeper structure", prompt: '"I found one structure. Challenge me—is there a deeper or more useful structure I\'m missing?"' }
        ],
        complexity: [
          { move: "Explore alternative ways to see the problem", prompt: '"I solved this one way. Ask me questions about whether there\'s a different way to see the problem."' },
          { move: "Introduce structural variations", prompt: '"What if the expression were slightly different? Ask me how the structure would change."' },
          { move: "Layer multiple structures", prompt: '"Are there multiple structures at work here? Ask me questions that help me see overlapping patterns."' }
        ],
        mirroring: [
          { move: "Reflect back perceived structure", prompt: '"Describe back to me the structure I seem to be seeing. Does it sound right when you say it?"' },
          { move: "Surface implicit pattern recognition", prompt: '"What patterns am I noticing without realizing it? Reflect back what you hear me assuming."' },
          { move: "Articulate decomposition strategy", prompt: '"How am I breaking this problem apart? Help me see my own decomposition strategy."' }
        ],
        simulation: [
          { move: "Test structure with new examples", prompt: '"If this structure is real, what should happen with a new example? Help me test it."' },
          { move: "Apply structure to harder case", prompt: '"If I apply this structural insight to a more complex problem, what should I expect?"' },
          { move: "Project structure-based shortcuts", prompt: '"If I recognize this structure in the future, what shortcut should it give me?"' }
        ],
        information: [
          { move: "Name structural categories", prompt: '"What are names for common mathematical structures? Help me categorize what I\'m seeing."' },
          { move: "Explain structural relationships", prompt: '"How do different mathematical structures relate to each other? Give me context without solving."' },
          { move: "Identify structure-finding strategies", prompt: '"What strategies do mathematicians use to find structure? List them without applying them for me."' }
        ],
        feedback: [
          { move: "Ask about decomposition possibilities", prompt: '"I\'m trying to simplify this expression. Ask me questions about how I might break it into pieces."' },
          { move: "Identify missed structural features", prompt: '"What features of this expression have I not commented on? Point to aspects I\'m overlooking."' },
          { move: "Flag superficial pattern recognition", prompt: '"Am I seeing a surface pattern but missing deeper structure? Point to where I should look closer."' }
        ]
      },
      collapseRigor: [
        { move: "Pointing out patterns", prompt: '"What pattern do you see in this expression?"' },
        { move: "Identifying structure for the student", prompt: '"This looks like a difference of squares—can you factor it?"' },
        { move: "Showing how to decompose", prompt: '"How should I break this problem apart?"' },
        { move: "Providing the insight", prompt: '"What\'s the key to solving this type of problem?"' }
      ]
    },
    returnToHuman: {
      task: "Articulate and Apply the Structure",
      description: "Based on the AI conversation, write an explanation of the structure or pattern you identified. Explain how recognizing this structure helped you solve the problem (or could help solve similar problems), and apply the insight to at least one new example.",
      criteria: [
        "Structure or pattern clearly articulated",
        "Explanation of how structure aids problem-solving",
        "Structure applied to a new example"
      ]
    },
    evidence: {
      artifacts: [
        "Initial observations about the problem (BEFORE AI)",
        "Chat transcript showing structure exploration",
        "Written explanation of structure with new application"
      ],
      reflection: "What structure did you eventually notice? How did recognizing it change your approach to the problem?"
    }
  },
  {
    id: 8,
    title: "Look for & Express Regularity in Repeated Reasoning",
    standards: "SMP-8",
    icon: RotateCw,
    description: "Students notice when calculations are repeated and look for general methods and shortcuts. They maintain oversight of the process while attending to details, continually evaluating reasonableness of intermediate results.",
    humanLift: [
      { step: "Notice Repetition", detail: "Recognize when you're doing the same type of calculation repeatedly." },
      { step: "Look for Shortcuts", detail: "Consider whether there's a more efficient method for repeated calculations." },
      { step: "Generalize", detail: "Express the pattern as a general rule, formula, or method." },
      { step: "Test the Generalization", detail: "Verify that your general rule works for multiple cases." },
      { step: "Maintain Oversight", detail: "Keep checking that your general method makes sense." }
    ],
    aiExtension: {
      role: "Generalization Prober",
      description: "AI asks about repeated reasoning and prompts generalization—but does not identify patterns or create formulas.",
      upholdRigor: {
        socratic: [
          { move: "Ask what's similar across multiple examples", prompt: '"I\'ve worked out several examples. Ask me questions that help me notice what\'s the same each time—don\'t tell me."' },
          { move: "Question whether a shortcut might exist", prompt: '"I keep doing the same steps over and over. Ask me questions that help me figure out if there\'s a shortcut."' },
          { move: "Probe for general patterns", prompt: '"Ask me questions about what I notice happening in each of these calculations."' }
        ],
        resistance: [
          { move: "Challenge whether generalizations always work", prompt: '"My generalization is this rule. Challenge it—ask me questions that test whether it really works in all cases."' },
          { move: "Push back on overgeneralization", prompt: '"I think this pattern always holds. Push back—ask me about cases where it might fail."' },
          { move: "Question the scope of the rule", prompt: '"I created this general rule. Challenge whether it applies as broadly as I think it does."' }
        ],
        complexity: [
          { move: "Introduce edge cases for testing", prompt: '"What happens with unusual inputs? Ask me questions about edge cases that might break my generalization."' },
          { move: "Explore extensions of the pattern", prompt: '"My pattern works for these cases. Ask me questions about whether it extends to harder cases."' },
          { move: "Layer additional constraints", prompt: '"What if there were additional constraints? Ask me how my generalization would need to change."' }
        ],
        mirroring: [
          { move: "Ask how to express regularity as a rule", prompt: '"I think I see a pattern. Ask me questions that help me express it as a general rule."' },
          { move: "Reflect back the generalization process", prompt: '"Walk back through how I went from examples to a rule. Does my process sound logical?"' },
          { move: "Surface implicit generalizations", prompt: '"What generalizations am I making without realizing it? Reflect back what you hear me assuming."' }
        ],
        simulation: [
          { move: "Test generalization with new cases", prompt: '"Let me try my rule on a new example. Ask me questions about whether it gives the right answer."' },
          { move: "Project rule to extreme cases", prompt: '"What does my rule predict for very large numbers or unusual inputs? Help me test the boundaries."' },
          { move: "Model rule application process", prompt: '"If someone else used my rule, would they get the same answer? Help me check if it\'s clear enough."' }
        ],
        information: [
          { move: "Identify generalization types", prompt: '"What types of mathematical generalizations exist (formulas, algorithms, theorems)? Help me categorize mine."' },
          { move: "Explain inductive reasoning", prompt: '"How does mathematical induction work? Explain the concept so I can apply it to justify my pattern."' },
          { move: "Clarify rule notation", prompt: '"How do mathematicians typically write general rules? Show me notation conventions."' }
        ],
        feedback: [
          { move: "Identify gaps in testing", prompt: '"What types of cases have I not tested my generalization on? Point to gaps in my verification."' },
          { move: "Flag unclear rule statements", prompt: '"Where is my generalization vague or ambiguous? Point to where I need to be more precise."' },
          { move: "Note missing justification", prompt: '"I have a rule that works, but why does it work? Point to where I need to add reasoning."' }
        ]
      },
      collapseRigor: [
        { move: "Identifying the repetition for the student", prompt: '"What\'s the pattern in these examples?"' },
        { move: "Suggesting generalizations", prompt: '"Can you give me a formula for this?"' },
        { move: "Creating the rule for the student", prompt: '"Write a general rule for solving problems like this."' },
        { move: "Testing the generalization for the student", prompt: '"Does my formula work? Test it for me."' }
      ]
    },
    returnToHuman: {
      task: "Express and Test Your Generalization",
      description: "Based on the AI conversation, write your generalization as a clear rule or formula. Test it on at least two new cases to verify it works. Document any exceptions or limitations you discover, and explain why the generalization holds.",
      criteria: [
        "Generalization expressed as a clear rule or formula",
        "Tested on multiple new cases",
        "Exceptions or limitations documented",
        "Justification for why the pattern holds"
      ]
    },
    evidence: {
      artifacts: [
        "Multiple worked examples (BEFORE AI)",
        "Chat transcript showing generalization discussion",
        "Written generalization with test cases and justification"
      ],
      reflection: "What repetition did you notice? How did expressing it as a general rule help you (or might help others)?"
    }
  }
];

// ============================================
// PRINCIPLE DROPDOWN COMPONENT
// ============================================
const PrincipleDropdown = ({ principle, moves, tierColor = 'green' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = principle.icon;

  const colorMap = {
    green: '#059669',
    amber: '#d97706',
    red: '#dc2626'
  };
  const iconColor = colorMap[tierColor] || colorMap.green;

  return (
    <div className="framework-principle-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="framework-principle-header"
      >
        <div className="framework-principle-left">
          <Icon size={16} className="principle-icon" style={{ color: iconColor }} />
          <span className="principle-label">{principle.name}</span>
          <span className="moves-count">({moves.length} {moves.length === 1 ? 'move' : 'moves'})</span>
        </div>
        {isOpen ? <ChevronDown size={16} style={{ color: '#9ca3af' }} /> : <ChevronRight size={16} style={{ color: '#9ca3af' }} />}
      </button>

      {isOpen && (
        <div className="framework-principle-content">
          {moves.map((item, idx) => (
            <div key={idx} className="framework-move-item">
              <p className="move-name">{item.move}</p>
              <p className="move-prompt">{item.prompt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// CASE STUDY CARD COMPONENT
// ============================================
const CaseStudyCard = ({ icon: IconComponent, iconBg, iconColor, title, meta, humanLift, aiRole, aiDescription, aiPrompts, returnToHuman }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="skill-card" style={{ marginBottom: '1rem' }}>
      <button onClick={() => setIsExpanded(!isExpanded)} className="skill-card-header">
        <div className="skill-card-left">
          <div className="skill-icon" style={{ background: iconBg }}>
            <IconComponent size={24} style={{ color: iconColor }} />
          </div>
          <div>
            <h3 className="skill-title">{title}</h3>
            <p className="skill-standards">{meta}</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="chevron" /> : <ChevronDown className="chevron" />}
      </button>

      {isExpanded && (
        <div className="skill-card-content">
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1.5rem' }}>{title}</h4>

          {/* Human Lift Section */}
          <div className="info-card" style={{ marginBottom: '1rem' }}>
            <h5 className="info-card-title human">Human Lift (Before AI)</h5>
            <p className="info-card-text">{humanLift}</p>
          </div>

          {/* AI Extension Section */}
          <div className="info-card" style={{ marginBottom: '1rem' }}>
            <h5 className="info-card-title" style={{ color: '#23abe1' }}>AI Extension: {aiRole}</h5>
            <p className="info-card-text" style={{ marginBottom: '1rem' }}>{aiDescription}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669' }}></span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#059669' }}>
                UPHOLD RIGOR — AI CREATES THINKING CONDITIONS
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {aiPrompts.map((item, idx) => {
                const PromptIcon = item.icon;
                return (
                  <div key={idx} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <PromptIcon size={16} style={{ color: '#059669' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>{item.principle}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>"{item.prompt}"</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Return to Human Section */}
          <div className="info-card">
            <h5 className="info-card-title human">Return to Human</h5>
            <p className="info-card-text">{returnToHuman}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// SKILL CARD COMPONENT
// ============================================
const SkillCard = ({ skill, isExpanded, onToggle }) => {
  const Icon = skill.icon;

  return (
    <div className="skill-card">
      <button onClick={onToggle} className="skill-card-header">
        <div className="skill-card-left">
          <div className="skill-icon">
            <Icon size={24} />
          </div>
          <div>
            <h3 className="skill-title">{skill.title}</h3>
            <p className="skill-standards">{skill.standards}</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="chevron" /> : <ChevronDown className="chevron" />}
      </button>

      {isExpanded && (
        <div className="skill-card-content">
          <p className="skill-description">{skill.description}</p>

          <div className="skill-grid">
            {/* 1. Human Lift */}
            <div className="skill-section">
              <h4 className="skill-section-title">
                <span className="section-number human">1</span>
                Human Lift (Before AI)
              </h4>
              <p className="section-subtitle">Students must complete independently</p>
              <ul className="human-lift-list">
                {skill.humanLift.map((item, idx) => (
                  <li key={idx}>
                    <span className="step-name">{idx + 1}. {item.step}:</span> {item.detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. AI Usage Taxonomy */}
            <div className="skill-section">
              <h4 className="skill-section-title">
                <span className="section-number ai">2</span>
                AI Usage Taxonomy: {skill.aiExtension.role}
              </h4>
              <p className="ai-description">{skill.aiExtension.description}</p>

              {/* Collapse Rigor */}
              <div className="taxonomy-tier">
                <div className="tier-title">
                  <span className="tier-dot collapse"></span>
                  <span className="tier-name collapse">Collapse Rigor</span>
                  <span className="tier-subtitle">— AI performs the cognitive work</span>
                </div>
                <div className="tier-principles">
                  <PrincipleDropdown
                    principle={{ id: 'taskCompletion', name: 'Task Completion', icon: XCircle }}
                    moves={skill.aiExtension.collapseRigor}
                    tierColor="red"
                  />
                </div>
              </div>

              {/* Neutral */}
              <div className="taxonomy-tier">
                <div className="tier-title">
                  <span className="tier-dot neutral"></span>
                  <span className="tier-name neutral">Neutral</span>
                  <span className="tier-subtitle">— AI provides; students decide how to engage</span>
                </div>
                <div className="tier-principles">
                  {aiExtensionPrinciples.filter(p => p.tier === 'neutral').map(principle => {
                    const moves = skill.aiExtension.upholdRigor[principle.id];
                    if (!moves || moves.length === 0) return null;
                    return <PrincipleDropdown key={principle.id} principle={principle} moves={moves} tierColor="amber" />;
                  })}
                </div>
              </div>

              {/* Uphold Rigor */}
              <div className="taxonomy-tier">
                <div className="tier-title">
                  <span className="tier-dot uphold"></span>
                  <span className="tier-name uphold">Uphold Rigor</span>
                  <span className="tier-subtitle">— AI creates conditions requiring student thinking</span>
                </div>
                <div className="tier-principles">
                  {aiExtensionPrinciples.filter(p => p.tier === 'uphold').map(principle => {
                    const moves = skill.aiExtension.upholdRigor[principle.id];
                    if (!moves || moves.length === 0) return null;
                    return <PrincipleDropdown key={principle.id} principle={principle} moves={moves} tierColor="green" />;
                  })}
                </div>
              </div>
            </div>

            {/* 3. Return to Human */}
            <div className="skill-section">
              <h4 className="skill-section-title">
                <span className="section-number return">3</span>
                Return to Human: {skill.returnToHuman.task}
              </h4>
              <p className="return-description">{skill.returnToHuman.description}</p>

              <p className="criteria-label">Success Criteria</p>
              <ul className="criteria-list">
                {skill.returnToHuman.criteria.map((item, idx) => (
                  <li key={idx}>
                    <CheckCircle size={14} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Evidence of Thinking */}
            <div className="skill-section">
              <h4 className="skill-section-title">
                <span className="section-number evidence">4</span>
                Evidence of Thinking
              </h4>
              <div style={{ marginBottom: '1rem' }}>
                <p className="criteria-label" style={{ color: '#6b7280' }}>Artifacts to Collect</p>
                <ul className="criteria-list">
                  {skill.evidence.artifacts.map((item, idx) => (
                    <li key={idx}>
                      <CheckCircle size={14} style={{ color: '#6b7280' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="criteria-label" style={{ color: '#6b7280' }}>Reflection Prompt</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', background: 'var(--color-bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontStyle: 'italic' }}>
                  "{skill.evidence.reflection}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// SCIENCE FRAMEWORK DATA
// ============================================
const scienceAiExtensionPrinciples = [
  {
    id: 'socratic',
    name: 'Socratic Questioning',
    shortName: 'Socratic',
    definition: 'AI asks probing questions that help students examine their reasoning, surface assumptions, and deepen understanding.',
    icon: HelpCircle,
    color: 'blue',
    tier: 'uphold'
  },
  {
    id: 'resistance',
    name: 'Productive Resistance',
    shortName: 'Resistance',
    definition: 'AI provides counterarguments, alternative perspectives, or skeptical pushback that students must address and defend against.',
    icon: Shield,
    color: 'orange',
    tier: 'uphold'
  },
  {
    id: 'complexity',
    name: 'Complexity Injection',
    shortName: 'Complexity',
    definition: 'AI introduces complicating factors, edge cases, or unconsidered dimensions that deepen engagement within the original task scope.',
    icon: Layers,
    color: 'purple',
    tier: 'uphold'
  },
  {
    id: 'mirroring',
    name: 'Reflective Mirroring',
    shortName: 'Mirroring',
    definition: 'AI summarizes, restates, or makes explicit what students have produced so they can evaluate their own thinking.',
    icon: Eye,
    color: 'teal',
    tier: 'neutral'
  },
  {
    id: 'simulation',
    name: 'Outcome Simulation',
    shortName: 'Simulation',
    definition: 'AI models what happens when student proposals are implemented, generating results that require interpretation.',
    icon: Play,
    color: 'green',
    tier: 'uphold'
  },
  {
    id: 'information',
    name: 'Strategic Information Provision',
    shortName: 'Information',
    definition: 'AI provides reference information, terminology, or structural options without performing the reasoning or analysis.',
    icon: Info,
    color: 'indigo',
    tier: 'neutral'
  },
  {
    id: 'feedback',
    name: 'Constructive Feedback',
    shortName: 'Feedback',
    definition: 'AI identifies gaps, weaknesses, or inconsistencies in student work without providing the solutions or fixes.',
    icon: MessageSquare,
    color: 'rose',
    tier: 'neutral'
  }
];

const scienceSkillsData = [
  {
    id: 1,
    title: "Asking Questions & Defining Problems",
    standards: "SEP-1",
    icon: HelpCircle,
    description: "Students ask questions about phenomena to clarify and seek information, or define problems to specify criteria and constraints for solutions.",
    humanLift: [
      { step: "Observe the Phenomenon Closely", detail: "Notice details, record observations, identify what's surprising or puzzling." },
      { step: "Distinguish Observations from Inferences", detail: "Separate what you directly observe from what you think is happening." },
      { step: "Generate Multiple Questions", detail: "Brainstorm questions that could be investigated—aim for quantity before quality." },
      { step: "Categorize Question Types", detail: "Sort questions into testable vs. non-testable, cause-effect vs. descriptive." },
      { step: "Prioritize for Investigation", detail: "Identify which questions are most important and feasible to investigate." }
    ],
    aiExtension: {
      role: "Question Refiner",
      description: "AI helps students sharpen and prioritize their questions—but does not generate questions for the student.",
      upholdRigor: {
        socratic: [
          { move: "Probe whether questions are testable", prompt: '"Here are the questions I generated about this phenomenon. Ask me questions that help me figure out which ones are actually testable."' }
        ],
        resistance: [
          { move: "Challenge vague or overly broad questions", prompt: '"I think my main question is this. Ask me questions that help me make it more specific and investigable."' }
        ],
        complexity: [
          { move: "Explore what variables could be manipulated", prompt: '"Ask me questions about what I could change and what I could measure in an investigation."' }
        ],
        mirroring: [
          { move: "Reflect back question assumptions", prompt: '"What am I assuming about this phenomenon in my question? Reflect back what you hear me taking for granted."' }
        ],
        simulation: [
          { move: "Project what answers might look like", prompt: '"If I investigate this question, what kinds of answers might I get? Help me think through possibilities."' }
        ],
        information: [
          { move: "Clarify question types", prompt: '"What types of scientific questions exist (descriptive, comparative, cause-effect)? Help me categorize mine."' }
        ],
        feedback: [
          { move: "Identify gaps in question coverage", prompt: '"What aspects of this phenomenon do my questions not address? Point to gaps without filling them."' }
        ]
      },
      collapseRigor: [
        { move: "Generating questions about the phenomenon", prompt: '"What questions should I ask about this phenomenon?"' },
        { move: "Explaining what\'s happening", prompt: '"Why does this phenomenon occur?"' }
      ]
    },
    returnToHuman: {
      task: "Refine and Prioritize Your Questions",
      description: "Based on the AI conversation, revise your question list. Select the top 2-3 questions that are most investigable.",
      criteria: ["Questions refined to be specific and testable", "Clear prioritization with rationale"]
    },
    evidence: {
      artifacts: ["Initial question brainstorm list (BEFORE AI)", "Chat transcript showing question refinement", "Final prioritized questions"],
      reflection: "How did your questions change after the AI conversation?"
    }
  },
  {
    id: 2,
    title: "Developing & Using Models",
    standards: "SEP-2",
    icon: Atom,
    description: "Students develop, use, and revise models to describe, predict, and explain phenomena.",
    humanLift: [
      { step: "Identify What Needs Explaining", detail: "Clarify the phenomenon or system the model should represent." },
      { step: "Draft an Initial Model", detail: "Create a visual, physical, or conceptual model showing components and relationships." },
      { step: "Label Key Components", detail: "Identify and name the parts of the system and how they interact." },
      { step: "Identify Model Limitations", detail: "Note what the model doesn't show or where it might break down." }
    ],
    aiExtension: {
      role: "Model Challenger",
      description: "AI pressure-tests student models by asking about limitations and predictions—but does not create or fix the model.",
      upholdRigor: {
        socratic: [
          { move: "Probe model component relationships", prompt: '"Ask me questions about how the parts of my model connect to each other."' }
        ],
        resistance: [
          { move: "Challenge whether model explains all observations", prompt: '"Here\'s my model. Ask me questions that help me identify what it doesn\'t explain well."' }
        ],
        complexity: [
          { move: "Explore what evidence would revise the model", prompt: '"Ask me questions about what new evidence might cause me to change my model."' }
        ],
        mirroring: [
          { move: "Reflect back model claims", prompt: '"Summarize what my model is claiming about this phenomenon."' }
        ],
        simulation: [
          { move: "Ask what the model predicts in new situations", prompt: '"My model works for situation A. Ask me if it would still work in new situations."' }
        ],
        information: [
          { move: "Clarify model types", prompt: '"What types of scientific models exist? Help me categorize mine."' }
        ],
        feedback: [
          { move: "Probe for missing components", prompt: '"Ask me questions about whether my model is missing any important parts."' }
        ]
      },
      collapseRigor: [
        { move: "Drawing or describing the model", prompt: '"Can you draw a model of this for me?"' },
        { move: "Fixing the model for the student", prompt: '"My model doesn\'t work—can you correct it?"' }
      ]
    },
    returnToHuman: {
      task: "Revise Your Model Based on Limitations",
      description: "Based on limitations identified in the AI conversation, revise your model.",
      criteria: ["Model revised to address identified limitations", "Annotations explaining what changed and why"]
    },
    evidence: {
      artifacts: ["Initial model sketch (BEFORE AI)", "Chat transcript showing model critique", "Revised model with annotations"],
      reflection: "What limitation in your model did the AI conversation help you identify?"
    }
  },
  {
    id: 3,
    title: "Planning & Carrying Out Investigations",
    standards: "SEP-3",
    icon: FlaskConical,
    description: "Students plan and conduct investigations to produce data that can serve as evidence.",
    humanLift: [
      { step: "Identify the Question to Answer", detail: "Clarify what the investigation is trying to figure out." },
      { step: "Identify Variables", detail: "Determine independent, dependent, and controlled variables." },
      { step: "Design the Procedure", detail: "Outline step-by-step what will be done, measured, and recorded." },
      { step: "Consider Reliability", detail: "Plan for multiple trials, appropriate sample sizes, and controls." }
    ],
    aiExtension: {
      role: "Investigation Auditor",
      description: "AI challenges investigation design by probing for flaws and gaps—but does not design the investigation.",
      upholdRigor: {
        socratic: [
          { move: "Question measurement choices", prompt: '"I\'m planning to measure this. Ask me questions about whether that will answer my question."' }
        ],
        resistance: [
          { move: "Challenge variable control", prompt: '"Here\'s my investigation plan. Ask me about variables I might not be controlling."' }
        ],
        complexity: [
          { move: "Explore alternative approaches", prompt: '"Ask me about other ways I could investigate this question."' }
        ],
        mirroring: [
          { move: "Reflect back investigation logic", prompt: '"Summarize the logic of my investigation—how does my procedure answer my question?"' }
        ],
        simulation: [
          { move: "Project possible outcomes", prompt: '"What different results might I get? Ask me what each would mean."' }
        ],
        information: [
          { move: "Clarify investigation types", prompt: '"What types of investigations exist? Help me categorize mine."' }
        ],
        feedback: [
          { move: "Identify gaps in procedure", prompt: '"What steps are missing from my procedure? Point to gaps without filling them."' }
        ]
      },
      collapseRigor: [
        { move: "Writing procedures for the student", prompt: '"Can you write a procedure for investigating this?"' },
        { move: "Identifying variables for the student", prompt: '"What variables do I need to control?"' }
      ]
    },
    returnToHuman: {
      task: "Revise Your Investigation Design",
      description: "Based on flaws identified in the AI conversation, revise your procedure.",
      criteria: ["Variables properly identified and controlled", "Procedure revised to address identified flaws"]
    },
    evidence: {
      artifacts: ["Initial investigation plan (BEFORE AI)", "Chat transcript showing design critique", "Revised procedure"],
      reflection: "What flaw in your investigation design did you discover?"
    }
  },
  {
    id: 4,
    title: "Analyzing & Interpreting Data",
    standards: "SEP-4",
    icon: LineChart,
    description: "Students analyze data to identify patterns, relationships, and anomalies.",
    humanLift: [
      { step: "Organize the Data", detail: "Create tables, graphs, or other representations that reveal patterns." },
      { step: "Identify Patterns", detail: "Look for trends, clusters, outliers, and relationships." },
      { step: "Quantify Relationships", detail: "Calculate averages, ranges, or other statistics as appropriate." },
      { step: "Connect to Question", detail: "Determine what the data tells you about your original question." }
    ],
    aiExtension: {
      role: "Data Interrogator",
      description: "AI challenges student interpretations by probing for alternative explanations—but does not analyze the data.",
      upholdRigor: {
        socratic: [
          { move: "Question pattern validity", prompt: '"I see this pattern in my data. Ask me if the pattern is real or coincidental."' }
        ],
        resistance: [
          { move: "Challenge causal claims", prompt: '"My data shows these two things happen together. Challenge me—does one cause the other?"' }
        ],
        complexity: [
          { move: "Probe for alternative explanations", prompt: '"Based on my data, I conclude this. Ask me about other explanations that might fit."' }
        ],
        mirroring: [
          { move: "Reflect back interpretation logic", prompt: '"Walk back through how I went from data to conclusion."' }
        ],
        simulation: [
          { move: "Test conclusions against new scenarios", prompt: '"If my conclusion is right, what should happen in a new situation?"' }
        ],
        information: [
          { move: "Clarify statistical concepts", prompt: '"What statistical concepts are relevant to my analysis? Explain without applying them."' }
        ],
        feedback: [
          { move: "Identify gaps in analysis", prompt: '"What aspects of my data have I not analyzed? Point to gaps."' }
        ]
      },
      collapseRigor: [
        { move: "Identifying patterns", prompt: '"What patterns do you see in my data?"' },
        { move: "Interpreting the data", prompt: '"What does my data show?"' }
      ]
    },
    returnToHuman: {
      task: "Strengthen Your Data Interpretation",
      description: "Based on alternative explanations raised in the AI conversation, revise your analysis.",
      criteria: ["Alternative explanations considered", "Conclusions explicitly connected to data evidence"]
    },
    evidence: {
      artifacts: ["Data tables/graphs (BEFORE AI)", "Chat transcript showing interpretation discussion", "Written analysis"],
      reflection: "What alternative explanation for your data did the AI help you consider?"
    }
  },
  {
    id: 5,
    title: "Constructing Explanations",
    standards: "SEP-6",
    icon: Lightbulb,
    description: "Students construct explanations of phenomena using evidence.",
    humanLift: [
      { step: "State the Claim Clearly", detail: "Articulate what you're explaining." },
      { step: "Gather Relevant Evidence", detail: "Identify data and observations that support the explanation." },
      { step: "Apply Scientific Principles", detail: "Connect evidence to accepted scientific ideas." },
      { step: "Address Limitations", detail: "Acknowledge what the explanation doesn't fully account for." }
    ],
    aiExtension: {
      role: "Explanation Challenger",
      description: "AI pressure-tests explanations by probing reasoning and evidence—but does not construct explanations.",
      upholdRigor: {
        socratic: [
          { move: "Probe for mechanism details", prompt: '"Ask me questions about the step-by-step mechanism of how this phenomenon works."' }
        ],
        resistance: [
          { move: "Challenge evidence-reasoning links", prompt: '"I claim this because of this evidence. Ask me how the evidence actually supports the claim."' }
        ],
        complexity: [
          { move: "Ask about alternative explanations", prompt: '"Ask me what alternative explanations exist and why mine is better supported."' }
        ],
        mirroring: [
          { move: "Reflect back explanation logic", prompt: '"Summarize the logic of my explanation. Does my reasoning sound valid?"' }
        ],
        simulation: [
          { move: "Test explanation against new cases", prompt: '"If my explanation is correct, what should happen in a new situation?"' }
        ],
        information: [
          { move: "Clarify explanation types", prompt: '"What types of scientific explanations exist? Help me categorize mine."' }
        ],
        feedback: [
          { move: "Question completeness", prompt: '"Ask me questions that help me identify gaps in my reasoning."' }
        ]
      },
      collapseRigor: [
        { move: "Explaining the phenomenon", prompt: '"Why does this phenomenon happen?"' },
        { move: "Constructing the explanation", prompt: '"Write an explanation for this."' }
      ]
    },
    returnToHuman: {
      task: "Strengthen Your Scientific Explanation",
      description: "Based on gaps identified in the AI conversation, revise your explanation.",
      criteria: ["Evidence-reasoning connections explicit", "Alternative explanations addressed"]
    },
    evidence: {
      artifacts: ["Draft explanation (BEFORE AI)", "Chat transcript showing explanation critique", "Revised explanation"],
      reflection: "What gap in your reasoning did the AI conversation reveal?"
    }
  },
  {
    id: 6,
    title: "Engaging in Argument from Evidence",
    standards: "SEP-7",
    icon: MessageSquare,
    description: "Students construct and defend arguments using evidence.",
    humanLift: [
      { step: "State Your Claim", detail: "Clearly articulate the position you're defending." },
      { step: "Marshal Evidence", detail: "Gather data and observations that support your claim." },
      { step: "Explain the Reasoning", detail: "Show how the evidence logically supports the claim." },
      { step: "Anticipate Counterarguments", detail: "Identify what someone who disagrees might say." }
    ],
    aiExtension: {
      role: "Argument Opponent",
      description: "AI acts as a respectful debate opponent, challenging arguments—but does not construct arguments.",
      upholdRigor: {
        socratic: [
          { move: "Question logical connections", prompt: '"Ask me about whether my reasoning logically connects my evidence to my claim."' }
        ],
        resistance: [
          { move: "Present counterarguments to address", prompt: '"Here\'s my argument. Act like a peer who disagrees and challenge me."' }
        ],
        complexity: [
          { move: "Ask for response to alternative interpretations", prompt: '"Ask me how I would respond to someone who interprets the evidence differently."' }
        ],
        mirroring: [
          { move: "Reflect back argument structure", prompt: '"Summarize the structure of my argument. Does it sound logical?"' }
        ],
        simulation: [
          { move: "Test argument against new evidence", prompt: '"If new evidence came out, how would it affect my argument?"' }
        ],
        information: [
          { move: "Clarify argument components", prompt: '"What are the parts of a scientific argument? Help me identify mine."' }
        ],
        feedback: [
          { move: "Identify gaps in evidence coverage", prompt: '"What aspects of my claim are not supported by evidence?"' }
        ]
      },
      collapseRigor: [
        { move: "Providing evidence or claims", prompt: '"What evidence supports this claim?"' },
        { move: "Making the argument", prompt: '"Write an argument for this position."' }
      ]
    },
    returnToHuman: {
      task: "Revise Your Argument to Address Challenges",
      description: "Based on counterarguments raised in the AI conversation, revise your argument.",
      criteria: ["Counterarguments explicitly addressed", "Evidence strengthened"]
    },
    evidence: {
      artifacts: ["Initial argument (BEFORE AI)", "Chat transcript showing argument defense", "Revised argument"],
      reflection: "What was the strongest counterargument you had to address?"
    }
  }
];

// ============================================
// SCIENCE FRAMEWORK COMPONENT
// ============================================
function ScienceFramework({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSkill, setExpandedSkill] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [expandedModelParts, setExpandedModelParts] = useState({ part1: true, part2: true, part3: true });

  // Lesson Designer State
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [lessonInputs, setLessonInputs] = useState({ lessonContext: '' });
  const [selectedMoves, setSelectedMoves] = useState([]);
  const [expandedPrinciples, setExpandedPrinciples] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutputs, setGeneratedOutputs] = useState(null);

  const selectedSkill = scienceSkillsData.find(s => s.id === parseInt(selectedSkillId));

  const toggleModelPart = (part) => {
    setExpandedModelParts(prev => ({ ...prev, [part]: !prev[part] }));
  };

  const handleExpandAll = () => {
    if (expandAll) setExpandedSkill(null);
    setExpandAll(!expandAll);
  };

  const handleSkillChange = (e) => {
    setSelectedSkillId(e.target.value);
    setSelectedMoves([]);
    setExpandedPrinciples({});
    setGeneratedOutputs(null);
  };

  const handleInputChange = (field, value) => {
    setLessonInputs(prev => ({ ...prev, [field]: value }));
  };

  const togglePrincipleExpanded = (principleId) => {
    setExpandedPrinciples(prev => ({ ...prev, [principleId]: !prev[principleId] }));
  };

  const handleMoveToggle = (moveKey) => {
    setSelectedMoves(prev =>
      prev.includes(moveKey) ? prev.filter(k => k !== moveKey) : [...prev, moveKey]
    );
  };

  const getMovesForSkill = (skill) => {
    if (!skill) return { neutral: {}, uphold: {} };
    const neutral = {};
    const uphold = {};
    Object.entries(skill.aiExtension.upholdRigor).forEach(([principleId, principleMoves]) => {
      const principle = scienceAiExtensionPrinciples.find(p => p.id === principleId);
      if (!principle) return;
      const movesWithMeta = principleMoves.map((move, idx) => ({
        ...move,
        principleId,
        principleName: principle.name,
        uniqueKey: `${principleId}-${idx}`
      }));
      if (principle.tier === 'neutral') {
        neutral[principleId] = movesWithMeta;
      } else if (principle.tier === 'uphold') {
        uphold[principleId] = movesWithMeta;
      }
    });
    return { neutral, uphold };
  };

  const { neutral: neutralMoves, uphold: upholdMoves } = getMovesForSkill(selectedSkill);
  const allSelectableMoves = [...Object.values(neutralMoves).flat(), ...Object.values(upholdMoves).flat()];

  const renderPrincipleDropdown = (principleId, moves, tierColor) => {
    const principle = scienceAiExtensionPrinciples.find(p => p.id === principleId);
    if (!principle || moves.length === 0) return null;
    const Icon = principle.icon;
    const isExpanded = expandedPrinciples[principleId];
    const selectedCount = moves.filter(m => selectedMoves.includes(m.uniqueKey)).length;

    const colorStyles = {
      amber: { bg: '#fef3c7', border: '#fbbf24', iconColor: '#d97706' },
      green: { bg: '#d1fae5', border: '#10b981', iconColor: '#059669' }
    };
    const styles = colorStyles[tierColor] || colorStyles.green;

    return (
      <div key={principleId} className="principle-dropdown" style={{ border: `1px solid ${styles.border}`, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.5rem' }}>
        <button
          onClick={() => togglePrincipleExpanded(principleId)}
          style={{ width: '100%', padding: '0.875rem 1rem', background: styles.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Icon size={20} style={{ color: styles.iconColor }} />
            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{principle.name}</span>
            {selectedCount > 0 && (
              <span style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem', background: 'rgba(0,0,0,0.1)', fontSize: '0.7rem', borderRadius: '999px', fontWeight: 600 }}>
                {selectedCount} selected
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{moves.length} moves</span>
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
        </button>
        {isExpanded && (
          <div style={{ padding: '1rem', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-subtle)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>{principle.definition}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {moves.map(move => (
                <label key={move.uniqueKey} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${selectedMoves.includes(move.uniqueKey) ? styles.border : 'var(--color-border)'}`, background: selectedMoves.includes(move.uniqueKey) ? styles.bg : 'var(--color-bg)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={selectedMoves.includes(move.uniqueKey)} onChange={() => handleMoveToggle(move.uniqueKey)} style={{ marginTop: '0.2rem' }} />
                  <div>
                    <p style={{ fontWeight: 500, color: 'var(--color-text)', fontSize: '0.9rem' }}>{move.move}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', marginTop: '0.25rem' }}>{move.prompt}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Science-specific PrincipleDropdown component
  const SciencePrincipleDropdown = ({ principle, moves, tierColor = 'green' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = principle.icon;

    const colorMap = {
      green: '#059669',
      amber: '#d97706',
      red: '#dc2626'
    };
    const iconColor = colorMap[tierColor] || colorMap.green;

    return (
      <div className="framework-principle-dropdown">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="framework-principle-header"
        >
          <div className="framework-principle-left">
            <Icon size={16} className="principle-icon" style={{ color: iconColor }} />
            <span className="principle-label">{principle.name}</span>
            <span className="moves-count">({moves.length} {moves.length === 1 ? 'move' : 'moves'})</span>
          </div>
          {isOpen ? <ChevronDown size={16} style={{ color: '#9ca3af' }} /> : <ChevronRight size={16} style={{ color: '#9ca3af' }} />}
        </button>

        {isOpen && (
          <div className="framework-principle-content">
            {moves.map((item, idx) => (
              <div key={idx} className="framework-move-item">
                <p className="move-name">{item.move}</p>
                <p className="move-prompt">{item.prompt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSkillCard = (skill) => {
    const isExpanded = expandAll || expandedSkill === skill.id;
    const IconComponent = skill.icon;

    return (
      <div key={skill.id} className="skill-card">
        <button onClick={() => !expandAll && setExpandedSkill(isExpanded ? null : skill.id)} className="skill-card-header">
          <div className="skill-card-left">
            <div className="skill-icon">
              <IconComponent size={24} />
            </div>
            <div>
              <h3 className="skill-title">{skill.title}</h3>
              <p className="skill-standards">{skill.standards}</p>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="chevron" /> : <ChevronDown className="chevron" />}
        </button>

        {isExpanded && (
          <div className="skill-card-content">
            <p className="skill-description">{skill.description}</p>

            <div className="skill-grid">
              {/* 1. Human Lift */}
              <div className="skill-section">
                <h4 className="skill-section-title">
                  <span className="section-number human">1</span>
                  Human Lift (Before AI)
                </h4>
                <p className="section-subtitle">Students must complete independently</p>
                <ul className="human-lift-list">
                  {skill.humanLift.map((item, idx) => (
                    <li key={idx}>
                      <span className="step-name">{idx + 1}. {item.step}:</span> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. AI Usage Taxonomy */}
              <div className="skill-section">
                <h4 className="skill-section-title">
                  <span className="section-number ai">2</span>
                  AI Usage Taxonomy: {skill.aiExtension.role}
                </h4>
                <p className="ai-description">{skill.aiExtension.description}</p>

                {/* Collapse Rigor */}
                <div className="taxonomy-tier">
                  <div className="tier-title">
                    <span className="tier-dot collapse"></span>
                    <span className="tier-name collapse">Collapse Rigor</span>
                    <span className="tier-subtitle">— AI performs the cognitive work</span>
                  </div>
                  <div className="tier-principles">
                    <SciencePrincipleDropdown
                      principle={{ id: 'taskCompletion', name: 'Task Completion', icon: XCircle }}
                      moves={skill.aiExtension.collapseRigor}
                      tierColor="red"
                    />
                  </div>
                </div>

                {/* Neutral */}
                <div className="taxonomy-tier">
                  <div className="tier-title">
                    <span className="tier-dot neutral"></span>
                    <span className="tier-name neutral">Neutral</span>
                    <span className="tier-subtitle">— AI provides; students decide how to engage</span>
                  </div>
                  <div className="tier-principles">
                    {scienceAiExtensionPrinciples.filter(p => p.tier === 'neutral').map(principle => {
                      const moves = skill.aiExtension.upholdRigor[principle.id];
                      if (!moves || moves.length === 0) return null;
                      return <SciencePrincipleDropdown key={principle.id} principle={principle} moves={moves} tierColor="amber" />;
                    })}
                  </div>
                </div>

                {/* Uphold Rigor */}
                <div className="taxonomy-tier">
                  <div className="tier-title">
                    <span className="tier-dot uphold"></span>
                    <span className="tier-name uphold">Uphold Rigor</span>
                    <span className="tier-subtitle">— AI creates conditions requiring student thinking</span>
                  </div>
                  <div className="tier-principles">
                    {scienceAiExtensionPrinciples.filter(p => p.tier === 'uphold').map(principle => {
                      const moves = skill.aiExtension.upholdRigor[principle.id];
                      if (!moves || moves.length === 0) return null;
                      return <SciencePrincipleDropdown key={principle.id} principle={principle} moves={moves} tierColor="green" />;
                    })}
                  </div>
                </div>
              </div>

              {/* 3. Return to Human */}
              <div className="skill-section">
                <h4 className="skill-section-title">
                  <span className="section-number return">3</span>
                  Return to Human: {skill.returnToHuman.task}
                </h4>
                <p className="return-description">{skill.returnToHuman.description}</p>

                <p className="criteria-label">Success Criteria</p>
                <ul className="criteria-list">
                  {skill.returnToHuman.criteria.map((item, idx) => (
                    <li key={idx}>
                      <CheckCircle size={14} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Evidence of Thinking */}
              <div className="skill-section">
                <h4 className="skill-section-title">
                  <span className="section-number evidence">4</span>
                  Evidence of Thinking
                </h4>
                <div style={{ marginBottom: '1rem' }}>
                  <p className="criteria-label" style={{ color: '#6b7280' }}>Artifacts to Collect</p>
                  <ul className="criteria-list">
                    {skill.evidence.artifacts.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle size={14} style={{ color: '#6b7280' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="criteria-label" style={{ color: '#6b7280' }}>Reflection Prompt</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', background: 'var(--color-bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontStyle: 'italic' }}>
                    "{skill.evidence.reflection}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-top-row">
            <button onClick={onBack} className="home-btn">
              <Home size={16} />
              <span>Home</span>
            </button>
          </div>
          <h1 className="header-title">AI-Enhanced Science Framework: A Research Preview</h1>
          <p className="header-subtitle">Integrating Generative AI into MS/HS Science Core Instruction</p>
        </div>

        {/* Navigation */}
        <nav className="nav-tabs">
          {['overview', 'framework', 'casestudies', 'designer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'framework' && 'Human-AI-Human in Science'}
              {tab === 'casestudies' && 'Case Studies'}
              {tab === 'designer' && 'Apply To Your Content'}
            </button>
          ))}
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'overview' && (
          <div className="overview-page">
            {/* Intro text */}
            <p className="overview-intro-text">
              This framework is grounded in the NGSS Science and Engineering Practices and the interconnected nature of asking questions, developing models, analyzing data, and constructing explanations. While these practices are inseparable in authentic scientific work, we name specific behaviors to help curriculum developers and teachers intentionally integrate AI literacy into existing content and build students' autonomy and fluency to use AI to deepen their thinking.
            </p>

            {/* Model Parts */}
            <div className="model-parts">
              {/* Part 1 */}
              <div className="model-part">
                <button onClick={() => toggleModelPart('part1')} className="model-part-header part1">
                  <div className="model-part-left">
                    <span className="part-badge part1">Part 1</span>
                    <h3>The Human-AI-Human Cycle</h3>
                  </div>
                  {expandedModelParts.part1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedModelParts.part1 && (
                  <div className="model-part-content">
                    <p>
                      The HAH Cycle ensures AI enhances rather than replaces scientific thinking. Students engage in substantial cognitive work before AI use, interact with AI as a <strong>thinking partner</strong> rather than an answer source, and return to human judgment for final sensemaking.
                    </p>

                    <div className="hah-cycle-grid">
                      <div className="hah-step human-first">
                        <div className="hah-icon">H</div>
                        <h4>Human First</h4>
                        <p>Students observe phenomena, generate questions, design investigations, and draft explanations <strong>before</strong> engaging AI. This ensures they develop their own scientific thinking.</p>
                      </div>
                      <div className="hah-step ai-partner">
                        <div className="hah-icon">AI</div>
                        <h4>AI as Thinking Partner</h4>
                        <p>AI creates conditions for deeper thinking through strategic questioning, productive resistance, and targeted feedback. AI <strong>never</strong> provides explanations or answers.</p>
                      </div>
                      <div className="hah-step human-final">
                        <div className="hah-icon">H</div>
                        <h4>Human Final</h4>
                        <p>Students revise their thinking based on the AI conversation and exercise <strong>scientific judgment</strong>. They decide which challenges to address and how.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Part 2 */}
              <div className="model-part">
                <button onClick={() => toggleModelPart('part2')} className="model-part-header part2">
                  <div className="model-part-left">
                    <span className="part-badge part2">Part 2</span>
                    <h3>The AI Usage Taxonomy</h3>
                  </div>
                  {expandedModelParts.part2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedModelParts.part2 && (
                  <div className="model-part-content">
                    <p>
                      Not all AI use is created equal. This taxonomy classifies AI interactions by their impact on student cognitive engagement—from uses that collapse rigor to those that actively uphold it.
                    </p>

                    {/* Collapse Rigor Tier */}
                    <div className="taxonomy-tier" style={{ marginTop: '1.5rem' }}>
                      <div className="tier-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#dc2626' }}></span>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>Collapse Rigor</h4>
                      </div>
                      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                        AI performs the cognitive work; students receive output.
                      </p>
                      <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                          Examples: AI explains the phenomenon, AI identifies patterns in data, AI constructs the explanation, AI designs the investigation. The student's role is reduced to prompting and accepting output.
                        </p>
                      </div>
                    </div>

                    {/* Neutral Tier */}
                    <div className="taxonomy-tier" style={{ marginTop: '1.5rem' }}>
                      <div className="tier-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#d97706' }}></span>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>Neutral</h4>
                      </div>
                      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                        AI provides something useful; students decide whether and how to engage.
                      </p>
                      <div className="hah-cycle-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {scienceAiExtensionPrinciples.filter(p => p.tier === 'neutral').map((principle) => {
                          const Icon = principle.icon;
                          return (
                            <div key={principle.id} className="hah-step" style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Icon size={18} style={{ color: '#d97706' }} />
                                <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{principle.name}</h4>
                              </div>
                              <p style={{ fontSize: '0.85rem', margin: 0 }}>{principle.definition}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Uphold Rigor Tier */}
                    <div className="taxonomy-tier" style={{ marginTop: '1.5rem' }}>
                      <div className="tier-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#059669' }}></span>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>Uphold Rigor</h4>
                      </div>
                      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                        AI creates conditions that require student thinking; students must think to respond.
                      </p>
                      <div className="hah-cycle-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {scienceAiExtensionPrinciples.filter(p => p.tier === 'uphold').map((principle) => {
                          const Icon = principle.icon;
                          return (
                            <div key={principle.id} className="hah-step" style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Icon size={18} style={{ color: '#059669' }} />
                                <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{principle.name}</h4>
                              </div>
                              <p style={{ fontSize: '0.85rem', margin: 0 }}>{principle.definition}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Part 3 */}
              <div className="model-part">
                <button onClick={() => toggleModelPart('part3')} className="model-part-header part3">
                  <div className="model-part-left">
                    <span className="part-badge part3">Part 3</span>
                    <h3>A New Approach to Assessment</h3>
                  </div>
                  {expandedModelParts.part3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedModelParts.part3 && (
                  <div className="model-part-content">
                    <p>
                      The HAH Cycle isn't complete until students demonstrate how they evaluated and integrated (or rejected) AI contributions. This means documenting the evolution of their thinking—from initial observations through AI-challenged reasoning to final explanations.
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                      The framework specifies what artifacts to collect for each practice. Two artifacts apply universally:
                    </p>
                    <div className="hah-cycle-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: '1rem' }}>
                      <div className="hah-step">
                        <h4>The AI Transcript</h4>
                        <p style={{ marginBottom: '0.75rem' }}>
                          The most valuable artifact is the AI transcript itself—a digital record of the student's scientific reasoning in dialogue with AI. This proves the student engaged in genuine scientific discourse.
                        </p>
                        <ul className="criteria-list">
                          <li>
                            <CheckCircle size={16} />
                            A shared link to the full chat conversation
                          </li>
                          <li>
                            <CheckCircle size={16} />
                            Screenshots of moments where they challenged AI or defended their reasoning
                          </li>
                        </ul>
                      </div>
                      <div className="hah-step">
                        <h4>The Reflection Statement</h4>
                        <p style={{ marginBottom: '0.75rem' }}>
                          At the end of each assignment, students answer three questions:
                        </p>
                        <ul className="criteria-list">
                          <li>
                            <CheckCircle size={16} />
                            What question did the AI ask that made you think differently about the phenomenon?
                          </li>
                          <li>
                            <CheckCircle size={16} />
                            What did you change in your model or explanation based on that challenge?
                          </li>
                          <li>
                            <CheckCircle size={16} />
                            What AI suggestion did you reject and why?
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'framework' && (
          <div className="framework-page">
            <div className="framework-header">
              <div>
                <h2>Human-AI-Human in Science</h2>
              </div>
              <button onClick={handleExpandAll} className="expand-all-btn">
                {expandAll ? 'Collapse All' : 'Expand All'}
              </button>
            </div>

            <p className="framework-intro-text">
              The HAH cycle is designed to be iterative. Early on, students need explicit scaffolding to engage AI productively — but over time, the structure becomes internalized. As students grow more skilled at prompting and evaluating AI responses, they begin to initiate meaningful AI engagement independently. The goal is fluency: students who instinctively use AI to challenge, extend, and sharpen their thinking rather than to bypass it.
            </p>

            {scienceSkillsData.map(skill => renderSkillCard(skill))}
          </div>
        )}

        {activeTab === 'casestudies' && (
          <div className="casestudies-page">
            <section className="casestudies-intro">
              <h2>Applying the HAH Cycle: OpenSciEd Case Studies</h2>
              <p>
                The following case studies illustrate how the Human-AI-Human Cycle applies to specific units from the <strong>OpenSciEd curriculum</strong>. Each example demonstrates how students engage with phenomena and complete authentic scientific work before using AI as a thinking partner.
              </p>
              <p>
                These examples are not scripts—they are models that teachers can adapt to their own phenomena and contexts.
              </p>
            </section>

            {/* Case Study 1 */}
            <CaseStudyCard
              icon={HelpCircle}
              iconBg="#fef3c7"
              iconColor="#d97706"
              title="Asking Questions: One-Way Mirror Phenomenon"
              meta="Unit 6.1 Light & Matter • Practice: Asking Questions"
              humanLift="Students independently observe the one-way mirror phenomenon, record what surprises them, generate questions, categorize them as testable vs. non-testable, and prioritize which would help explain the phenomenon."
              aiRole="Question Refiner"
              aiDescription="Students use AI to sharpen and prioritize their questions without generating questions for them."
              aiPrompts={[
                { principle: 'Socratic Questioning', icon: HelpCircle, prompt: "Here are my questions about the one-way mirror. Ask me questions that help me figure out what I would actually measure to answer each one." },
                { principle: 'Productive Resistance', icon: Shield, prompt: "I think my main question is investigable. Challenge me—am I actually investigating or just confirming what I assume?" }
              ]}
              returnToHuman="Students revise their question list, selecting the top 2-3 questions to pursue. They explain why these questions are investigable and predict what they might find."
            />

            {/* Case Study 2 */}
            <CaseStudyCard
              icon={Atom}
              iconBg="#d1fae5"
              iconColor="#059669"
              title="Developing Models: Thermal Energy Transfer"
              meta="Unit 6.2 Thermal Energy • Practice: Developing & Using Models"
              humanLift="After initial investigations, students independently draw a particle-level model showing what's happening inside and outside both cups—including particles, their motion, and energy transfer."
              aiRole="Model Challenger"
              aiDescription="Students use AI to pressure-test their models by asking about limitations and predictions."
              aiPrompts={[
                { principle: 'Socratic Questioning', icon: HelpCircle, prompt: "Ask me questions about how the parts of my model connect to each other. What interactions am I showing?" },
                { principle: 'Productive Resistance', icon: Shield, prompt: "I think my model is accurate. Challenge me—where might it misrepresent what's really happening with the particles?" }
              ]}
              returnToHuman="Students revise their models based on limitations identified. Final models include annotations explaining what they changed and why."
            />

            {/* Case Study 3 */}
            <CaseStudyCard
              icon={FlaskConical}
              iconBg="#cffafe"
              iconColor="#0891b2"
              title="Planning Investigations: Chemical Reactions"
              meta="Unit 7.1 Chemical Reactions & Matter • Practice: Planning Investigations"
              humanLift="Students independently design an investigation to determine whether mass is conserved during a bath bomb reaction. They identify variables, outline procedure, plan for multiple trials, and anticipate problems."
              aiRole="Investigation Auditor"
              aiDescription="Students use AI to challenge their investigation design by probing for flaws and gaps."
              aiPrompts={[
                { principle: 'Socratic Questioning', icon: HelpCircle, prompt: "I'm planning to measure mass before and after. Ask me questions about whether that measurement will actually answer my question." },
                { principle: 'Productive Resistance', icon: Shield, prompt: "I've identified my variables. Challenge me—what variables might I be missing?" }
              ]}
              returnToHuman="Students revise their investigation design based on gaps identified. They submit revised procedure with justifications for changes."
            />

            {/* Case Study 4 */}
            <CaseStudyCard
              icon={LineChart}
              iconBg="#dbeafe"
              iconColor="#2563eb"
              title="Analyzing Data: MRE Flameless Heater"
              meta="Unit 7.2 Chemical Reactions & Energy • Practice: Analyzing Data"
              humanLift="Students independently create graphs of temperature data, identify patterns (rate of change, maximum temperature, cooling curve), note anomalies, and draft initial interpretations."
              aiRole="Data Interrogator"
              aiDescription="Students use AI to challenge their interpretations by probing for alternative explanations."
              aiPrompts={[
                { principle: 'Socratic Questioning', icon: HelpCircle, prompt: "I see this pattern in my temperature data. Ask me questions about whether the pattern is real or coincidental." },
                { principle: 'Productive Resistance', icon: Shield, prompt: "My data shows these two things happen together. Challenge me—does one cause the other?" }
              ]}
              returnToHuman="Students revise their data analysis, addressing alternative explanations. Written analysis must explicitly connect patterns to claims about energy transfer."
            />

            {/* Case Study 5 */}
            <CaseStudyCard
              icon={Lightbulb}
              iconBg="#fae8ff"
              iconColor="#a855f7"
              title="Constructing Explanations: M'Kenna's Symptoms"
              meta="Unit 7.3 Metabolic Reactions • Practice: Constructing Explanations"
              humanLift="Students independently gather evidence about digestion, cellular respiration, and metabolic reactions. They draft an explanation connecting molecular-level processes to body-level effects."
              aiRole="Explanation Challenger"
              aiDescription="Students use AI to pressure-test explanations by probing reasoning and evidence."
              aiPrompts={[
                { principle: 'Socratic Questioning', icon: HelpCircle, prompt: "Ask me questions about each step in my causal reasoning. How does molecular damage lead to these body symptoms?" },
                { principle: 'Productive Resistance', icon: Shield, prompt: "I'm applying this scientific principle to my explanation. Challenge me—am I using it correctly?" }
              ]}
              returnToHuman="Students revise their explanation to strengthen evidence-reasoning connections. Final explanation shows clear chain from molecular processes to symptoms."
            />

            {/* Case Study 6 */}
            <CaseStudyCard
              icon={MessageSquare}
              iconBg="#ffe4e6"
              iconColor="#e11d48"
              title="Argument from Evidence: Penguin Evolution"
              meta="Unit 8.6 Natural Selection & Common Ancestry • Practice: Engaging in Argument"
              humanLift="After analyzing fossil evidence and anatomical data, students independently construct an argument for how natural selection explains penguin diversity. They marshal evidence and anticipate counterarguments."
              aiRole="Argument Opponent"
              aiDescription="Students use AI as a respectful debate opponent, challenging their arguments."
              aiPrompts={[
                { principle: 'Socratic Questioning', icon: HelpCircle, prompt: "Ask me questions about whether my reasoning logically connects my fossil evidence to my claim about common ancestry." },
                { principle: 'Productive Resistance', icon: Shield, prompt: "I'm using this evidence to support natural selection. Challenge me—does it really prove what I think?" }
              ]}
              returnToHuman="Students revise their argument to address counterarguments. Final argument explicitly responds to challenges, demonstrating ability to defend claims under scrutiny."
            />

            {/* Case Study 7 */}
            <CaseStudyCard
              icon={BookOpen}
              iconBg="#e0e7ff"
              iconColor="#4f46e5"
              title="Evaluating Information: Ecosystem Dynamics"
              meta="Unit 7.5 Ecosystem Dynamics • Practice: Obtaining & Evaluating Information"
              humanLift="Students independently locate and read scientific sources about ecosystem phenomena. They evaluate source credibility, identify key claims, and note where sources agree or conflict."
              aiRole="Source Evaluator"
              aiDescription="Students use AI to challenge source evaluation and synthesis."
              aiPrompts={[
                { principle: 'Socratic Questioning', icon: HelpCircle, prompt: "Ask me why I chose these sources over others. What criteria am I using to evaluate credibility?" },
                { principle: 'Productive Resistance', icon: Shield, prompt: "I think this source supports my point. Challenge me—am I reading it correctly?" }
              ]}
              returnToHuman="Students synthesize information across sources, noting where they reconciled conflicting claims. Final synthesis demonstrates critical integration of scientific information."
            />

            {/* Case Study 8 */}
            <CaseStudyCard
              icon={Beaker}
              iconBg="#ffedd5"
              iconColor="#ea580c"
              title="Designing Solutions: Homemade Flameless Heater"
              meta="Unit 7.2 Chemical Reactions & Energy • Practice: Designing Solutions"
              humanLift="Students independently define criteria and constraints, brainstorm solutions, evaluate trade-offs, and develop a detailed design plan including materials, quantities, and predicted performance."
              aiRole="Design Reviewer"
              aiDescription="Students use AI to challenge their design by probing for flaws and unconsidered factors."
              aiPrompts={[
                { principle: 'Socratic Questioning', icon: HelpCircle, prompt: "Ask me why I chose these materials and quantities. What criteria am I optimizing for?" },
                { principle: 'Productive Resistance', icon: Shield, prompt: "I think my design will reach the target temperature. Challenge me—what could make it fall short?" }
              ]}
              returnToHuman="Students revise their design based on challenges identified. After testing, they document performance against criteria and what they would change."
            />
          </div>
        )}

        {activeTab === 'designer' && (
          <div className="lesson-designer">
            <div className="progress-indicator">
              <div className="progress-steps">
                <div className={`progress-step ${selectedSkillId ? 'completed' : 'active'}`}>
                  <div className="progress-step-number">1</div>
                  <div className="progress-step-label">Practice</div>
                </div>
                <div className="progress-line"><div className={`progress-line-fill ${selectedSkillId ? 'filled' : ''}`}></div></div>
                <div className={`progress-step ${lessonInputs.lessonContext ? 'completed' : selectedSkillId ? 'active' : ''}`}>
                  <div className="progress-step-number">2</div>
                  <div className="progress-step-label">Context</div>
                </div>
                <div className="progress-line"><div className={`progress-line-fill ${lessonInputs.lessonContext ? 'filled' : ''}`}></div></div>
                <div className={`progress-step ${selectedMoves.length > 0 ? 'completed' : lessonInputs.lessonContext ? 'active' : ''}`}>
                  <div className="progress-step-number">3</div>
                  <div className="progress-step-label">AI Moves</div>
                </div>
                <div className="progress-line"><div className={`progress-line-fill ${selectedMoves.length > 0 ? 'filled' : ''}`}></div></div>
                <div className={`progress-step ${generatedOutputs ? 'completed' : selectedMoves.length > 0 ? 'active' : ''}`}>
                  <div className="progress-step-number">4</div>
                  <div className="progress-step-label">Generate</div>
                </div>
              </div>
            </div>

            <section className="designer-section">
              <div className="step-header">
                <span className="step-number" style={{ background: '#23abe1' }}>1</span>
                <h3>Select Science & Engineering Practice</h3>
              </div>
              <p className="section-description">What scientific practice will students engage with?</p>
              <select value={selectedSkillId} onChange={handleSkillChange} className="skill-select">
                <option value="">-- Select a practice --</option>
                {scienceSkillsData.map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.title} ({skill.standards})</option>
                ))}
              </select>
              {selectedSkill && <p className="skill-description">{selectedSkill.description}</p>}
            </section>

            <section className="designer-section">
              <div className="step-header">
                <span className="step-number" style={{ background: '#23abe1' }}>2</span>
                <h3>Provide Lesson Context</h3>
              </div>
              <p className="section-description">Describe your lesson including phenomenon, investigation, grade level, and curriculum.</p>
              <textarea
                placeholder="e.g., 7th grade students are investigating why a special cup keeps drinks cold longer than a regular cup (OpenSciEd Unit 6.2). They've conducted investigations comparing temperature changes and collected data..."
                value={lessonInputs.lessonContext}
                onChange={(e) => handleInputChange('lessonContext', e.target.value)}
                rows={6}
                className="context-textarea"
              />
            </section>

            <section className="designer-section" style={{ opacity: selectedSkill ? 1 : 0.5 }}>
              <div className="step-header">
                <span className="step-number" style={{ background: '#23abe1' }}>3</span>
                <h3>Select AI Moves</h3>
              </div>
              <p className="section-description">Select moves from the Neutral and Uphold Rigor tiers that fit this practice.</p>

              {!selectedSkill ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
                  <p>Please select a Science & Engineering Practice above to see available AI moves.</p>
                </div>
              ) : (
                <>
                  <div className="tier-block">
                    <div className="tier-block-header">
                      <span className="tier-dot neutral"></span>
                      <span className="tier-block-label neutral">Neutral — AI Provides, Student Decides</span>
                    </div>
                    <div className="principles-list">
                      {scienceAiExtensionPrinciples.filter(p => p.tier === 'neutral').map(principle => {
                        const moves = neutralMoves[principle.id];
                        if (!moves || moves.length === 0) return null;
                        return renderPrincipleDropdown(principle.id, moves, 'amber');
                      })}
                    </div>
                  </div>

                  <div className="tier-block">
                    <div className="tier-block-header">
                      <span className="tier-dot uphold"></span>
                      <span className="tier-block-label uphold">Uphold Rigor — AI Creates Thinking Conditions</span>
                    </div>
                    <div className="principles-list">
                      {scienceAiExtensionPrinciples.filter(p => p.tier === 'uphold').map(principle => {
                        const moves = upholdMoves[principle.id];
                        if (!moves || moves.length === 0) return null;
                        return renderPrincipleDropdown(principle.id, moves, 'green');
                      })}
                    </div>
                  </div>

                  {selectedMoves.length > 0 && (
                    <div className="selection-summary">
                      <p><strong>{selectedMoves.length} move{selectedMoves.length !== 1 ? 's' : ''} selected</strong></p>
                    </div>
                  )}

                  <div className="generate-section" style={{ marginTop: '1.5rem' }}>
                    <button
                      onClick={() => {}}
                      disabled={selectedMoves.length === 0 || isGenerating}
                      className="generate-button"
                      style={{ background: selectedMoves.length === 0 || isGenerating ? '#d1d5db' : '#23abe1' }}
                    >
                      <Sparkles size={20} />
                      Generate Lesson Materials
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </main>

    </div>
  );
}

// ============================================
// MATH FRAMEWORK COMPONENT
// ============================================
function MathFramework({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSkill, setExpandedSkill] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [expandedModelParts, setExpandedModelParts] = useState({ part1: true, part2: true, part3: true });

  const toggleModelPart = (part) => {
    setExpandedModelParts(prev => ({ ...prev, [part]: !prev[part] }));
  };

  const handleExpandAll = () => {
    if (expandAll) {
      setExpandedSkill(null);
    }
    setExpandAll(!expandAll);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-top-row">
            <button onClick={onBack} className="home-btn">
              <Home size={16} />
              <span>Home</span>
            </button>
          </div>
          <h1 className="header-title">AI-Enhanced Math Skills Framework: A Research Preview</h1>
          <p className="header-subtitle">Integrating Generative AI into MS/HS Mathematics Core Instruction</p>
        </div>

        {/* Navigation */}
        <nav className="nav-tabs">
          {['overview', 'framework', 'casestudies', 'designer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'framework' && 'Human-AI-Human in Math'}
              {tab === 'casestudies' && 'Case Studies'}
              {tab === 'designer' && 'Apply To Your Content'}
            </button>
          ))}
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'overview' && (
          <div className="overview-page">
            {/* Intro text - no box, just flowing text like ELA */}
            <p className="overview-intro-text">
              This framework is grounded in the Standards for Mathematical Practice and the interconnected nature of problem-solving, reasoning, and mathematical communication. While these practices are inseparable in authentic mathematical work, we name specific behaviors to help curriculum developers and teachers intentionally integrate AI literacy into existing content and build students' autonomy and fluency to use AI to deepen their thinking.
            </p>

            {/* Model Parts - directly following intro */}
            <div className="model-parts">
                  {/* Part 1 */}
                  <div className="model-part">
                    <button onClick={() => toggleModelPart('part1')} className="model-part-header part1">
                      <div className="model-part-left">
                        <span className="part-badge part1">Part 1</span>
                        <h3>The Human-AI-Human Cycle</h3>
                      </div>
                      {expandedModelParts.part1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {expandedModelParts.part1 && (
                      <div className="model-part-content">
                        <p>
                          The HAH Cycle ensures AI enhances rather than replaces mathematical thinking. Students engage in substantial cognitive work before AI use, interact with AI as a <strong>thinking partner</strong> rather than an answer source, and return to human judgment for final reasoning.
                        </p>

                        <div className="hah-cycle-grid">
                          <div className="hah-step human-first">
                            <div className="hah-icon">H</div>
                            <h4>Human First</h4>
                            <p>Students attempt problems, make sense of situations, develop strategies, and form initial solutions <strong>before</strong> engaging AI.</p>
                          </div>
                          <div className="hah-step ai-partner">
                            <div className="hah-icon">AI</div>
                            <h4>AI as Thinking Partner</h4>
                            <p>AI creates conditions for deeper thinking through strategic questioning, productive resistance, and targeted feedback. AI <strong>never</strong> solves problems.</p>
                          </div>
                          <div className="hah-step human-final">
                            <div className="hah-icon">H</div>
                            <h4>Human Final</h4>
                            <p>Students revise their thinking based on the AI conversation and exercise <strong>mathematical judgment</strong>. They decide which challenges to address.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Part 2 */}
                  <div className="model-part">
                    <button onClick={() => toggleModelPart('part2')} className="model-part-header part2">
                      <div className="model-part-left">
                        <span className="part-badge part2">Part 2</span>
                        <h3>The AI Usage Taxonomy</h3>
                      </div>
                      {expandedModelParts.part2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {expandedModelParts.part2 && (
                      <div className="model-part-content">
                        <p>
                          Not all AI use is created equal. This taxonomy classifies AI interactions by their impact on student cognitive engagement—from uses that collapse rigor to those that actively uphold it.
                        </p>

                        {/* Collapse Rigor Tier */}
                        <div className="taxonomy-tier" style={{ marginTop: '1.5rem' }}>
                          <div className="tier-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#dc2626' }}></span>
                            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>Collapse Rigor</h4>
                          </div>
                          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                            AI performs the cognitive work; students receive output.
                          </p>
                          <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                              Examples: AI solves the problem, AI generates the proof, AI provides the answer, AI explains the solution. The student's role is reduced to prompting and accepting output.
                            </p>
                          </div>
                        </div>

                        {/* Neutral Tier */}
                        <div className="taxonomy-tier" style={{ marginTop: '1.5rem' }}>
                          <div className="tier-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#d97706' }}></span>
                            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>Neutral</h4>
                          </div>
                          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                            AI provides something useful; students decide whether and how to engage.
                          </p>
                          <div className="hah-cycle-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            {aiExtensionPrinciples.filter(p => p.tier === 'neutral').map((principle) => {
                              const Icon = principle.icon;
                              return (
                                <div key={principle.id} className="hah-step" style={{ padding: '1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Icon size={18} style={{ color: '#d97706' }} />
                                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{principle.name}</h4>
                                  </div>
                                  <p style={{ fontSize: '0.85rem', margin: 0 }}>{principle.definition}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Uphold Rigor Tier */}
                        <div className="taxonomy-tier" style={{ marginTop: '1.5rem' }}>
                          <div className="tier-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#059669' }}></span>
                            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>Uphold Rigor</h4>
                          </div>
                          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                            AI creates conditions that require student thinking; students must think to respond.
                          </p>
                          <div className="hah-cycle-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            {aiExtensionPrinciples.filter(p => p.tier === 'uphold').map((principle) => {
                              const Icon = principle.icon;
                              return (
                                <div key={principle.id} className="hah-step" style={{ padding: '1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Icon size={18} style={{ color: '#059669' }} />
                                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{principle.name}</h4>
                                  </div>
                                  <p style={{ fontSize: '0.85rem', margin: 0 }}>{principle.definition}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Part 3 */}
                  <div className="model-part">
                    <button onClick={() => toggleModelPart('part3')} className="model-part-header part3">
                      <div className="model-part-left">
                        <span className="part-badge part3">Part 3</span>
                        <h3>A New Approach to Assessment</h3>
                      </div>
                      {expandedModelParts.part3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {expandedModelParts.part3 && (
                      <div className="model-part-content">
                        <p>
                          The HAH Cycle isn't complete until students demonstrate how they evaluated and integrated (or rejected) AI contributions.
                        </p>
                        <div className="hah-cycle-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                          <div className="hah-step">
                            <h4>The AI Transcript</h4>
                            <p style={{ marginBottom: '0.75rem' }}>
                              The most valuable artifact is the AI transcript itself—a digital record of the student's mathematical reasoning in dialogue with AI.
                            </p>
                            <ul className="criteria-list">
                              <li>
                                <CheckCircle size={16} />
                                A shared link to the full chat conversation
                              </li>
                              <li>
                                <CheckCircle size={16} />
                                Screenshots of moments where they defended their reasoning
                              </li>
                            </ul>
                          </div>
                          <div className="hah-step">
                            <h4>The Reflection Statement</h4>
                            <p style={{ marginBottom: '0.75rem' }}>
                              At the end of each assignment, students answer three questions:
                            </p>
                            <ul className="criteria-list">
                              <li>
                                <CheckCircle size={16} />
                                What question did the AI ask that made you think differently?
                              </li>
                              <li>
                                <CheckCircle size={16} />
                                What did you change in your solution based on that challenge?
                              </li>
                              <li>
                                <CheckCircle size={16} />
                                What AI suggestion did you reject and why?
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'framework' && (
          <div className="framework-page">
            <div className="framework-header">
              <div>
                <h2>Human-AI-Human in Math</h2>
              </div>
              <button onClick={handleExpandAll} className="expand-all-btn">
                {expandAll ? 'Collapse All' : 'Expand All'}
              </button>
            </div>

            <p className="framework-intro-text">
              The HAH cycle is designed to be iterative. Early on, students need explicit scaffolding to engage AI productively — but over time, the structure becomes internalized. As students grow more skilled at prompting and evaluating AI responses, they begin to initiate meaningful AI engagement independently. The goal is fluency: students who instinctively use AI to challenge, extend, and sharpen their thinking rather than to bypass it.
            </p>

            {skillsData.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isExpanded={expandAll || expandedSkill === skill.id}
                onToggle={() => {
                  if (expandAll) return;
                  setExpandedSkill(expandedSkill === skill.id ? null : skill.id);
                }}
              />
            ))}
          </div>
        )}

        {activeTab === 'casestudies' && (
          <div className="casestudies-page">
            <section className="casestudies-intro">
              <h2>Applying the HAH Cycle: Illustrative Mathematics Case Studies</h2>
              <p>
                The following case studies illustrate how the Human-AI-Human Cycle applies to specific units from the <strong>Illustrative Mathematics curriculum</strong>. Each example demonstrates how students engage with problems and complete authentic mathematical work before using AI as a thinking partner.
              </p>
              <p>
                These examples are not scripts—they are models that teachers can adapt to their own problems and contexts.
              </p>
            </section>

            {/* Case Study 1 */}
            <CaseStudyCard
              icon={Target}
              iconBg="#fef3c7"
              iconColor="#d97706"
              title="Make Sense of Problems: Budget Constraints"
              meta="Algebra 1 Unit 2 • Practice: Make Sense & Persevere"
              humanLift="Students independently read the problem, restate it in their own words, identify what quantities are given and unknown, and consider multiple entry points."
              aiRole="Problem Clarifier"
              aiDescription="Students use AI to ask probing questions about their problem understanding without getting solutions."
              aiPrompts={[
                { principle: 'Socratic Questioning', icon: HelpCircle, prompt: "I'm working on a budget constraint problem. Here's how I understand it: [student explanation]. Ask me questions to help me check if I'm understanding this correctly." },
                { principle: 'Productive Resistance', icon: Shield, prompt: "I think the constraint means I can't spend more than $50. Challenge my interpretation—am I missing something about how budget constraints work?" }
              ]}
              returnToHuman="Students revise their problem understanding and approach based on the AI conversation. They document how their understanding shifted."
            />

            {/* Case Study 2 */}
            <CaseStudyCard
              icon={Shuffle}
              iconBg="#ede9fe"
              iconColor="#7c3aed"
              title="Reason Abstractly: Proportional Relationships"
              meta="Grade 7 Unit 2 • Practice: Reason Abstractly & Quantitatively"
              humanLift="Students independently identify the quantities involved, represent the relationship symbolically, manipulate the equation, and interpret what their answer means."
              aiRole="Context Connector"
              aiDescription="Students use AI to challenge their translations between context and symbols."
              aiPrompts={[
                { principle: 'Socratic Questioning', icon: HelpCircle, prompt: "I wrote y = 3x to represent the recipe relationship. Ask me questions to help me check if my equation captures the real-world meaning." },
                { principle: 'Complexity Injection', icon: Layers, prompt: "What if the recipe needed to be scaled for a different number of people? How would that change my equation?" }
              ]}
              returnToHuman="Students revise their interpretation, explicitly connecting their mathematical work to the context."
            />

            {/* Case Study 3 */}
            <CaseStudyCard
              icon={MessageSquare}
              iconBg="#cffafe"
              iconColor="#0891b2"
              title="Construct Arguments: Properties of Operations"
              meta="Grade 7 Unit 6 • Practice: Construct Arguments & Critique Reasoning"
              humanLift="Students independently construct an argument for why two expressions are equivalent, citing the distributive property."
              aiRole="Argument Challenger"
              aiDescription="Students use AI as a skeptical peer to challenge each step of their reasoning."
              aiPrompts={[
                { principle: 'Productive Resistance', icon: Shield, prompt: "I claim that 3(x + 2) = 3x + 6 because of the distributive property. Challenge my reasoning—what might I be missing or oversimplifying?" },
                { principle: 'Socratic Questioning', icon: HelpCircle, prompt: "I used the distributive property to justify this step. Ask me questions that would help me explain why this property works." }
              ]}
              returnToHuman="Students revise their argument to address gaps in justification."
            />
          </div>
        )}

        {activeTab === 'designer' && (
          <LessonDesigner skillsData={skillsData} />
        )}
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <p>AI-Enhanced Math Skills Framework</p>
        <p className="landing-footer-subtitle">Integrating Generative AI into MS/HS Mathematics Core Instruction</p>
      </footer>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const [currentView, setCurrentView] = useState('landing');

  return (
    <div className="app-container">
      {currentView === 'landing' && (
        <LandingPage
          onSelectMath={() => setCurrentView('math')}
          onSelectScience={() => setCurrentView('science')}
        />
      )}
      {currentView === 'math' && (
        <MathFramework onBack={() => setCurrentView('landing')} />
      )}
      {currentView === 'science' && (
        <ScienceFramework onBack={() => setCurrentView('landing')} />
      )}
    </div>
  );
}

export default App;
