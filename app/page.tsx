"use client";

import { useEffect, useMemo, useState } from "react";

type CoachNote = {
  name: string;
  chapter: string;
  page: string;
  quote: string;
  reflection: string;
  fieldStory: string;
  questionSeed: string;
};

type ConversationNote = {
  id: number;
  speaker: string;
  note: string;
  tagged: boolean;
};

type AppState = {
  activeCoach: number;
  activeStep: number;
  meetingTheme: string;
  fontScale: "normal" | "large";
  coaches: CoachNote[];
  conversation: ConversationNote[];
  closingLine: string;
};

const STORAGE_KEY = "carnegie-reading-circle-v1";

const steps = ["책 문장", "내 성찰", "AI 질문", "대화 기록"];

const seedCoaches: CoachNote[] = [
  {
    name: "1번 코치",
    chapter: "마음을 움직이는 말",
    page: "",
    quote: "상대가 스스로 중요하다고 느끼게 하라.",
    reflection: "",
    fieldStory: "",
    questionSeed: "상대의 체면과 자존심을 세우는 대화",
  },
  {
    name: "2번 코치",
    chapter: "좋은 청중이 되는 법",
    page: "",
    quote: "진심 어린 관심은 대화를 바꾼다.",
    reflection: "",
    fieldStory: "",
    questionSeed: "임원 시절 회의에서 듣는 태도",
  },
  {
    name: "3번 코치",
    chapter: "반감을 줄이는 표현",
    page: "",
    quote: "논쟁에서 이기는 가장 좋은 방법은 논쟁을 피하는 것이다.",
    reflection: "",
    fieldStory: "",
    questionSeed: "갈등 상황에서 말의 온도를 낮추는 방식",
  },
];

const initialState: AppState = {
  activeCoach: 0,
  activeStep: 0,
  meetingTheme: "데일 카네기의 성공 대화론",
  fontScale: "normal",
  coaches: seedCoaches,
  conversation: [
    {
      id: 1,
      speaker: "진행자",
      note: "오늘은 책에서 붙잡은 문장 하나와 실제 현장 경험 하나만 나눕니다.",
      tagged: true,
    },
  ],
  closingLine: "",
};

const questionBanks = [
  {
    label: "경청",
    questions: [
      "이 문장이 말하는 경청은 단순히 조용히 듣는 것과 무엇이 다를까요?",
      "내가 임원으로 일할 때 가장 듣기 어려웠던 말은 무엇이었나요?",
      "요즘 코칭 현장에서 상대가 진짜 듣고 싶어 하는 말은 무엇일까요?",
      "대화 중 내가 말을 줄이면 어떤 가능성이 열릴까요?",
    ],
  },
  {
    label: "존중",
    questions: [
      "상대의 자존심을 지켜준 대화와 무너뜨린 대화는 무엇이 달랐나요?",
      "내가 가진 직함이나 경험이 대화의 거리감을 만든 적은 없었나요?",
      "상대가 스스로 답을 찾도록 남겨둘 수 있는 한 문장은 무엇일까요?",
      "이 책의 조언을 오늘 가족이나 동료에게 적용한다면 어디서 시작할까요?",
    ],
  },
  {
    label: "갈등",
    questions: [
      "논쟁을 피한다는 말은 회피와 어떻게 구분될까요?",
      "성과 압박이 큰 회의에서 말의 온도를 낮춘 경험이 있나요?",
      "내가 옳다는 확신을 내려놓아야 했던 순간은 언제였나요?",
      "상대가 반대할 때 먼저 인정할 수 있는 부분은 무엇일까요?",
    ],
  },
  {
    label: "리더십",
    questions: [
      "카네기의 대화법은 명령하는 리더십과 어떤 차이를 만들까요?",
      "임원 시절의 성공 경험 중 지금은 다르게 말하고 싶은 장면이 있나요?",
      "후배 리더에게 이 문장을 전한다면 어떤 사례와 함께 말하겠나요?",
      "좋은 대화가 조직의 실행력으로 이어진 사례는 무엇이었나요?",
    ],
  },
];

function loadState(): AppState {
  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return initialState;
    }

    const parsed = JSON.parse(saved) as Partial<AppState>;
    return {
      ...initialState,
      ...parsed,
      coaches: parsed.coaches?.length ? parsed.coaches : initialState.coaches,
      conversation: parsed.conversation?.length
        ? parsed.conversation
        : initialState.conversation,
    };
  } catch {
    return initialState;
  }
}

export default function Home() {
  const [state, setState] = useState<AppState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [speaker, setSpeaker] = useState("참여 코치");
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setState(loadState());
      setLoaded(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [loaded, state]);

  useEffect(() => {
    if (!timerRunning) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          setTimerRunning(false);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [timerRunning]);

  const activeCoach = state.coaches[state.activeCoach];

  const generatedQuestions = useMemo(() => {
    const seed = activeCoach.questionSeed || activeCoach.quote || state.meetingTheme;
    const bank =
      questionBanks.find((item) => seed.includes(item.label)) ||
      questionBanks[state.activeCoach % questionBanks.length];

    return [
      `이 문장이 지금 붙잡히는 이유는 무엇인가요?`,
      ...bank.questions,
      `"${shorten(seed, 28)}"을 실제 코칭 장면으로 옮기면 첫 질문은 무엇일까요?`,
    ];
  }, [activeCoach, state.activeCoach, state.meetingTheme]);

  const taggedNotes = state.conversation.filter((note) => note.tagged);
  const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const seconds = String(timerSeconds % 60).padStart(2, "0");

  function updateCoach(index: number, updates: Partial<CoachNote>) {
    setState((current) => ({
      ...current,
      coaches: current.coaches.map((coach, coachIndex) =>
        coachIndex === index ? { ...coach, ...updates } : coach,
      ),
    }));
  }

  function addConversationNote() {
    if (!newNote.trim()) {
      return;
    }

    setState((current) => ({
      ...current,
      conversation: [
        {
          id: Date.now(),
          speaker: speaker.trim() || "참여 코치",
          note: newNote.trim(),
          tagged: false,
        },
        ...current.conversation,
      ],
    }));
    setNewNote("");
  }

  function toggleTagged(id: number) {
    setState((current) => ({
      ...current,
      conversation: current.conversation.map((note) =>
        note.id === id ? { ...note, tagged: !note.tagged } : note,
      ),
    }));
  }

  function resetTimer(secondsValue: number) {
    setTimerRunning(false);
    setTimerSeconds(secondsValue);
  }

  function resetAll() {
    setState(initialState);
    setTimerSeconds(90);
    setTimerRunning(false);
    setNewNote("");
  }

  return (
    <main className={state.fontScale === "large" ? "app largeText" : "app"}>
      <section className="topBand" aria-labelledby="app-title">
        <div className="topCopy">
          <p className="eyebrow">Business Coach Reading Circle</p>
          <h1 id="app-title">성공 대화론 독서모임</h1>
          <input
            aria-label="모임 주제"
            className="themeInput"
            value={state.meetingTheme}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                meetingTheme: event.target.value,
              }))
            }
          />
        </div>
        <div className="topActions" aria-label="화면 설정">
          <button
            className="utilityButton"
            onClick={() =>
              setState((current) => ({
                ...current,
                fontScale: current.fontScale === "large" ? "normal" : "large",
              }))
            }
          >
            글자 크게
          </button>
          <button className="utilityButton" onClick={() => window.print()}>
            인쇄
          </button>
          <button className="dangerButton" onClick={resetAll}>
            새 모임
          </button>
        </div>
      </section>

      <section className="stepBand" aria-label="오늘의 흐름">
        {steps.map((step, index) => (
          <button
            key={step}
            className={state.activeStep === index ? "stepButton active" : "stepButton"}
            onClick={() =>
              setState((current) => ({ ...current, activeStep: index }))
            }
          >
            <span>{index + 1}</span>
            {step}
          </button>
        ))}
      </section>

      <section className="coachTabs" aria-label="발제 코치 선택">
        {state.coaches.map((coach, index) => (
          <button
            key={coach.name}
            className={state.activeCoach === index ? "coachTab active" : "coachTab"}
            onClick={() =>
              setState((current) => ({ ...current, activeCoach: index }))
            }
          >
            {coach.name}
          </button>
        ))}
      </section>

      <section className="workspace">
        <article className="panel quotePanel">
          <div className="panelHeading">
            <p>1. 책 문장</p>
            <div className="timer" aria-label="낭독 타이머">
              <strong>
                {minutes}:{seconds}
              </strong>
              <button onClick={() => setTimerRunning((running) => !running)}>
                {timerRunning ? "멈춤" : "낭독"}
              </button>
              <button onClick={() => resetTimer(90)}>90초</button>
              <button onClick={() => resetTimer(180)}>3분</button>
            </div>
          </div>
          <div className="fieldRow">
            <label>
              코치 이름
              <input
                value={activeCoach.name}
                onChange={(event) =>
                  updateCoach(state.activeCoach, { name: event.target.value })
                }
              />
            </label>
            <label>
              장 또는 주제
              <input
                value={activeCoach.chapter}
                onChange={(event) =>
                  updateCoach(state.activeCoach, { chapter: event.target.value })
                }
              />
            </label>
            <label>
              쪽수
              <input
                value={activeCoach.page}
                onChange={(event) =>
                  updateCoach(state.activeCoach, { page: event.target.value })
                }
              />
            </label>
          </div>
          <label className="textField">
            오늘 붙잡은 책 문장
            <textarea
              rows={5}
              value={activeCoach.quote}
              onChange={(event) =>
                updateCoach(state.activeCoach, { quote: event.target.value })
              }
            />
          </label>
        </article>

        <article className="panel reflectionPanel">
          <div className="panelHeading">
            <p>2. 내 성찰</p>
            <span className="quietLabel">짧게 적어도 충분합니다</span>
          </div>
          <label className="textField">
            이 문장이 나에게 걸린 이유
            <textarea
              rows={5}
              value={activeCoach.reflection}
              onChange={(event) =>
                updateCoach(state.activeCoach, { reflection: event.target.value })
              }
              placeholder="예: 말을 잘하는 것보다 상대가 말하고 싶어지게 만드는 힘을 다시 생각했다."
            />
          </label>
          <label className="textField">
            대기업 현장 또는 코칭 장면에서 떠오른 사례
            <textarea
              rows={5}
              value={activeCoach.fieldStory}
              onChange={(event) =>
                updateCoach(state.activeCoach, { fieldStory: event.target.value })
              }
              placeholder="예: 회의에서 반대 의견을 바로 꺾지 않고 먼저 인정했을 때 분위기가 달라졌다."
            />
          </label>
        </article>

        <article className="panel aiPanel">
          <div className="panelHeading">
            <p>3. AI 질문 카드</p>
            <span className="quietLabel">요약보다 질문</span>
          </div>
          <label className="textField">
            질문의 방향
            <input
              value={activeCoach.questionSeed}
              onChange={(event) =>
                updateCoach(state.activeCoach, {
                  questionSeed: event.target.value,
                })
              }
              placeholder="예: 경청, 존중, 갈등, 리더십"
            />
          </label>
          <div className="questionChips" aria-label="질문 방향 빠른 선택">
            {questionBanks.map((bank) => (
              <button
                key={bank.label}
                onClick={() =>
                  updateCoach(state.activeCoach, {
                    questionSeed: `${bank.label} - ${activeCoach.chapter}`,
                  })
                }
              >
                {bank.label}
              </button>
            ))}
          </div>
          <ol className="questions">
            {generatedQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </article>

        <article className="panel conversationPanel">
          <div className="panelHeading">
            <p>4. 대화 기록</p>
            <span className="quietLabel">남길 말만 표시</span>
          </div>
          <div className="noteComposer">
            <input
              aria-label="말한 사람"
              value={speaker}
              onChange={(event) => setSpeaker(event.target.value)}
            />
            <textarea
              aria-label="대화 메모"
              rows={4}
              value={newNote}
              onChange={(event) => setNewNote(event.target.value)}
              placeholder="대화 중 남기고 싶은 한 문장을 적습니다."
            />
            <button className="primaryButton" onClick={addConversationNote}>
              기록 추가
            </button>
          </div>
          <div className="notesList">
            {state.conversation.map((note) => (
              <button
                key={note.id}
                className={note.tagged ? "noteItem tagged" : "noteItem"}
                onClick={() => toggleTagged(note.id)}
              >
                <strong>{note.speaker}</strong>
                <span>{note.note}</span>
                <small>{note.tagged ? "남김" : "표시"}</small>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="closingBand" aria-label="마무리">
        <div>
          <p className="eyebrow">오늘의 한 문장</p>
          <textarea
            value={state.closingLine}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                closingLine: event.target.value,
              }))
            }
            placeholder="오늘 모임이 끝난 뒤 각자 가져갈 한 문장을 남깁니다."
          />
        </div>
        <div className="takeaways">
          {taggedNotes.length ? (
            taggedNotes.map((note) => (
              <p key={note.id}>
                <strong>{note.speaker}</strong>
                {note.note}
              </p>
            ))
          ) : (
            <p>대화 기록에서 남길 말을 표시하면 여기에 모입니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function shorten(value: string, limit: number) {
  const normalized = value.trim();
  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, limit)}...`;
}
