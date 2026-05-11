import { useContext, useEffect, useState } from "react";
import { frequencyUnits, isFrequencyUnit, isMonsterKind, monsterKinds, monsterName, randomMonsterKind } from "./types";
import logo from "./assets/logo.png";
import vampire from "./assets/vampire.webp";
import MiniNav from "./MiniNav";
import Nav from "./Nav";
import dayjs from "dayjs";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { GuestIdContext } from "./GuestIdContext";
import { get, post } from "./requests";
/** @import { FrequencyUnit, Level, Monster } from "./types" */


/**
 * @typedef {"hero" | "task" | "loading"} HomeMode
 */

/**
 * @typedef {(monsters: Monster[]) => void} SetMonsters
 */

/**
 * @typedef {(callback: ((monsters: Monster[]) => Monster[])) => void} UpdateMonsters
 */

/**
 * 
 * @typedef {{
 *   list: Monster[]
 *   set: (monsters: Monster[]) => void
 *   update: (callback: ((monsters: Monster[]) => Monster[])) => void
 *   setMonster: (monster: Monster) => void
 *   deleteMonster: (monster: Monster) => void
 * }} MonsterProps
 */

function Home() {
  const [task, setTask] = useState("");
  const [hp, setHp] = useState(null);
  const [xp, setXp] = useState(null);
  const [monsters, setMonsters] = useState(/** @type {Monster[]} */ ([]));
  const [didSubmitTask, setDidSubmitTask] = useState(false);
  const [mode, setMode] = useState(/** @type {HomeMode} */ ("loading"));
  const guestId = useContext(GuestIdContext);

  useEffect(() => {
    get('/api/profile', guestId).then(data => {
      console.log(data);
      const monsters = data?.profile?.monsters;
      if (Array.isArray(monsters)) {
        setMonsters(monsters);
        if (monsters.length > 0) {
          setMode("task");
          return;
        }
      }
      setMode("hero");
    });
  }, []);

  /**
   * 
   * @param {Monster[]} monsters 
   */
  function saveMonsters(monsters) {
    post('/api/monsters', guestId, { monsters });
    setMonsters(monsters);
    console.log('haaaa')
  }

  function submitTask() {
    const words = task.trim().split(" ");
    if (words.length === 0) {
      return;
    }
    const lastWord = words[words.length - 1];
    if (lastWord.length === 0) {
      return;
    }
    const taskName = lastWord[0].toUpperCase() + lastWord.slice(1);

    let id = monsters.length;
    for (const m of monsters) {
      if (m.id >= id) {
        id = m.id + 1;
      }
    }

    let monsterKind = randomMonsterKind();
    for (let i = 0; i < 9; i++) {
      if (monsters.some(m => m.kind === monsterKind)) {
        monsterKind = randomMonsterKind();
      } else {
        break;
      }
    }
    const level = randomLevel();
    const frequencyMagnitude = 5;
    const frequencyUnit = 'second';
    const deadline = getDeadline(frequencyMagnitude, frequencyUnit);
    const hp = 2;
    saveMonsters([
      ...monsters,
      {
        id,
        taskName,
        kind: monsterKind,
        maxHp: hp,
        currentHp: hp,
        task,
        level,
        frequencyMagnitude: frequencyMagnitude.toString(),
        frequencyUnit,
        deadline,
      }
    ]);
    setTask("");
    setDidSubmitTask(true);
            console.log("hoo hey");

  }

  
  /** @type {MonsterProps} */
  const monsterProps = {
    list: monsters,
    set: saveMonsters,
    update(callback) {
      setMonsters(monsters => {
        const newMonsters = callback(monsters);
        post('/api/monsters', guestId, { monsters: newMonsters });
        return newMonsters;
      });
    },
    setMonster(newMonster) {
      this.set(monsters.map(found => {
        if (found.id === newMonster.id) {
          return newMonster;
        } else {
          return found;
        }
      }));
    },
    deleteMonster(monster) {
      this.set(this.list.filter(found => found.id !== monster.id));
    }
  };
  return (
    <>
      <title>Task Slayer</title>
      <Header />
      {mode === "loading" ?
        <></> :
        <>
          {mode === "task" ?
            <></> :
            <Hero didSubmitTask={didSubmitTask} />
          }
          <MonsterSection monsters={monsterProps} task={task} setTask={setTask} submitTask={submitTask} />
        </>
      }
    </>
  );
}

/**
 * 
 * @param {{ didSubmitTask: boolean }} props 
 */
function Hero({ didSubmitTask }) {
  return (
    <div className={
      (didSubmitTask ? "before-shrink shrink" : "before-shrink")
    }>
      <div className="hero">
        <img className="hero-logo" alt="logo" src={logo} />
        <div className="hero-heading">Task Slayer</div>
        <div className="hero-subheading">Finish tasks. Slay monsters. Level up.</div>
      </div>
    </div>
  );
}

/**
 * 
 * @param {{
 *   monsters: MonsterProps
 *   task: string
 *   setTask: (task: string) => void
 *   submitTask: () => void
 * }} props 
 * @returns 
 */
function MonsterSection({ monsters, task, setTask, submitTask }) {
  /** @type {React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>} */
  function onChangeTask(e) {
    setTask(e.target.value);
  }
  /** @type {React.SubmitEventHandler<HTMLFormElement>} */
  function onSubmitTask(e) {
    e.preventDefault();
    submitTask();
  }
  return (
    <div className="home-monsters-section">
      <div className="home-monsters-container">
        <h2 className="home-monsters-heading">What monsters will we slay today?</h2>
        <form onSubmit={onSubmitTask}>
          <input
            className="home-monsters-input"
            onChange={onChangeTask}
            value={task}
            placeholder="try: do the laundry"
          />
        </form>
        <div className="home-monsters">
          {monsters.list.map(m => {
            return (
              <Monster key={m.id} monster={m} monsters={monsters} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 
 * @param {{
 *   monster: Monster
 *   monsters: MonsterProps
 * }} props 
 */
function Monster({ monster, monsters }) {
  const [editing, setEditing] = useState(false);
  function switchToEdit() {
    setEditing(true);
  }
  function switchToView() {
    setEditing(false);
  }
  return editing ?
    <MonsterEdit monster={monster} monsters={monsters} switchToView={switchToView} /> :
    <MonsterView monster={monster} monsters={monsters} switchToEdit={switchToEdit} />
}

/**
 * 
 * @param {{
 *   monster: Monster
 *   monsters: MonsterProps
 *   switchToEdit: () => void
 * }} props 
 */
function MonsterView({ monster, monsters, switchToEdit }) {
  const [_, setTime] = useState(Date.now());
  const name = monsterName(monster);
  function attack() {
    const newHp = Math.max(monster.currentHp - 1, 0);
    console.log(newHp);


    if (newHp === 0) {
      monsters.setMonster({
        ...monster,
        currentHp: newHp,
      });
    } else {
      const newDeadline = tryAdvanceDeadline(monster);
      if (newDeadline !== null) {
        console.log(dayjs(newDeadline).format("mm:ss"));
      }
      monsters.setMonster({
        ...monster,
        currentHp: newHp,
        deadline: newDeadline,
      });
    }
  }
  const level = formatLevel(monster.level);
  const hp = monster.currentHp / monster.maxHp * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
      monsters.update(monsters => {
        return monsters.map(found => {
          if (found.id !== monster.id) return found;
          if (found.deadline === null) return found;
          const frequencyMagnitude = parseFrequencyMagnitude(found.frequencyMagnitude);
          if (frequencyMagnitude === null) {
            return found;
          }
          const deadline = found.deadline;
          if (Date.now() < deadline) return found;
          const newDeadline = getDeadline(frequencyMagnitude, found.frequencyUnit);
          if (found.currentHp === 0) {
            const hp = found.currentHp === 0 ? found.maxHp : found.currentHp;
            const level = randomLevel();
            console.log("revivve");
            return {
              ...found,
              currentHp: hp,
              level,
              deadline: newDeadline,
            };
          } else {
            console.log("chaneg");
            return {
              ...found,
              deadline: newDeadline,
            };
          }
        });
      });
    }, 67);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="font-sans p-2 bg-slate-700 rounded-sm text-slate-100" key={monster.id}>
        <div className="flex gap-x-2">
          <div className="flex flex-col gap-y-0.5 items-center min-w-20">
            <img alt="vampire" src={vampire} className="rounded w-20 h-20 object-cover object-top" />
            <div className="text-center text-slate-400 bg-slate-950 rounded w-full">{level}</div>
          </div>
          <div className="flex flex-col grow">
            <div className="flex justify-between">
              <div>{name}</div>
              <button onClick={switchToEdit} className="cursor-pointer">
                <span className="material-symbols-outlined text-slate-400">edit</span>
              </button>
            </div>
            <div>{monster.task}</div>
            <MonsterFrequency monsters={monsters} monster={monster} />
            <div className="flex flex-col grow justify-end gap-y-2 items-center mt-2">
              <div className="w-full h-1.5 bg-gray-500 rounded-[3px]">
                <div
                  className="h-1.5 bg-red-500 rounded-[3px]"
                  style={{ width: `${hp}%` }}
                ></div>
              </div>
              <AttackButtonOrStatus monster={monster} attack={attack} />
            </div>
          </div>
        </div>
    </div>
  );
}

/**
 * 
 * @param {{
 *   monster: Monster
 *   attack: () => void
 * }} props 
 */
function AttackButtonOrStatus({ monster, attack }) {
  return (
    monster.currentHp === 0 ?
      <div className="flex bg-green-800 h-7 rounded-[14px] w-full items-center justify-center" >Slain</div> :
      isTaskCompleted(monster) ?
        <div className="flex bg-green-600 h-7 rounded-[14px] w-full items-center justify-center" >Pacified</div> :
        <button onClick={attack} className="cursor-pointer bg-sky-600 h-7 rounded-[14px] w-full" >Attack</button>
  );
}

/**
 * 
 * @param {{
 *   monsters: MonsterProps
 *   monster: Monster
 * }} props 
 */
function MonsterFrequency({ monsters, monster }) {
  const frequencyMagnitude = parseFrequencyMagnitude(monster.frequencyMagnitude);
  const frequencyResult = formatFrequency(monster.frequencyMagnitude, monster.frequencyUnit);
  return (
    (frequencyResult.invalidMagnitude || frequencyMagnitude === null || monster.deadline === null) ? 
      <div className="text-red-300">Invalid frequency</div> :
      <ValidMonsterFrequency
        monsters={monsters}
        monster={monster}
        frequencyMagnitude={frequencyMagnitude}
        frequencyString={frequencyResult.value}
        deadline={monster.deadline}
      />
  );
}

/**
 * 
 * @param {{
 *   monsters: MonsterProps
 *   monster: Monster
 *   frequencyMagnitude: number
 *   frequencyString: string
 *   deadline: number
 * }} props 
 */
function ValidMonsterFrequency({ monsters, monster, frequencyMagnitude, frequencyString, deadline }) {
  // const [time, setTime] = useState(Date.now());
  const period = getPeriod(frequencyMagnitude, monster.frequencyUnit);
  const periodEnd = isTaskCompleted(monster) ? 
    (deadline - period) :
    deadline;
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime(Date.now());
  //     monsters.update(monsters => {
  //       return monsters.map(found => {
  //         if (found.id !== monster.id) return found;
  //         if (found.deadline === null) return found;
  //         const frequencyMagnitude = parseFrequencyMagnitude(found.frequencyMagnitude);
  //         if (frequencyMagnitude === null) {
  //           return found;
  //         }
  //         const deadline = found.deadline;
  //         const period = getPeriod(frequencyMagnitude, found.frequencyUnit);
  //         const periodEnd = isTaskCompleted(found) ? 
  //           (deadline - period) :
  //           deadline;
  //         if (Date.now() < periodEnd) return found;
  //         const newDeadline = getDeadline(frequencyMagnitude, found.frequencyUnit);
  //         if (found.currentHp === 0) {
  //           const hp = found.currentHp === 0 ? found.maxHp : found.currentHp;
  //           const level = randomLevel();
  //           return {
  //             ...found,
  //             currentHp: hp,
  //             level,
  //             deadline: newDeadline,
  //           };
  //         } else {
  //           return {
  //             ...found,
  //             deadline: newDeadline,
  //           };
  //         }
  //       });
  //     });
  //     // if (Date.now() > periodEnd) {
  //     //   const deadline = tryGetDeadline(monster.frequencyMagnitude, monster.frequencyUnit);
  //     //   if (monster.currentHp === 0) {
  //     //     const hp = monster.currentHp === 0 ? monster.maxHp : monster.currentHp;
  //     //     const level = randomLevel();
  //     //     setMonster({
  //     //       ...monster,
  //     //       currentHp: hp,
  //     //       level,
  //     //       deadline,
  //     //     });
  //     //   } else {
  //     //     setMonster({
  //     //       ...monster,
  //     //       deadline,
  //     //     });
  //     //   }
  //     // }
  //     // setTime(Date.now());
  //   }, 67);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);
  const timeLeft = periodEnd - Date.now();
  const p = Math.max(Math.min(timeLeft / period, 1), 0);
  return (
    <div className="flex items-center gap-x-2">
      <div>{frequencyString}</div>
      <div className="w-5 h-5 mt-0.5">
        <CircularProgressbar
          className="text-red-500"
          value={p}
          maxValue={1}
          strokeWidth={50}
          styles={buildStyles({
            pathColor: 'var(--color-amber-500)',
            strokeLinecap: "butt"
          })}
        />
      </div>
    </div>
  );
}

/**
 * 
 * @param {Monster} monster
 * @returns {boolean}
 */
function isTaskCompleted(monster) {
  if (monster.deadline === null) {
    return false;
  }
  const parsedMagnitude = parseFrequencyMagnitude(monster.frequencyMagnitude);
  if (parsedMagnitude === null) {
    return false;
  }
  return monster.deadline - Date.now() > getPeriod(parsedMagnitude, monster.frequencyUnit);
}

/**
 * 
 * @param {number} frequencyMagnitude
 * @param {FrequencyUnit} frequencyUnit
 * @returns {number}
 */
function getPeriod(frequencyMagnitude, frequencyUnit) {
  return dayjs().add(frequencyMagnitude, frequencyUnit).diff(dayjs()).valueOf();
}

/**
 * 
 * @param {string} frequencyMagnitude
 * @param {FrequencyUnit} frequencyUnit
 * @returns {number | null}
 */
function tryGetDeadline(frequencyMagnitude, frequencyUnit) {
  const deadline = tryGetDeadlineObj(frequencyMagnitude, frequencyUnit);
  if (deadline === null) {
    return null;
  }
  return deadline.valueOf();
}

/**
 * 
 * @param {string} frequencyMagnitude
 * @param {FrequencyUnit} frequencyUnit
 * @returns {dayjs.Dayjs | null}
 */
function tryGetDeadlineObj(frequencyMagnitude, frequencyUnit) {
  const parsedMagnitude = parseFrequencyMagnitude(frequencyMagnitude);
  if (parsedMagnitude === null) {
    return null;
  }
  return getDeadlineObj(parsedMagnitude, frequencyUnit);
}

/**
 * 
 * @param {Monster} monster
 * @returns {number | null}
 */
function tryAdvanceDeadline(monster) {
  if (monster.deadline === null) {
    return null;
  }
  const parsedMagnitude = parseFrequencyMagnitude(monster.frequencyMagnitude);
  if (parsedMagnitude === null) {
    return null;
  }
  const newDeadline = dayjs(monster.deadline).add(parsedMagnitude, monster.frequencyUnit).valueOf();
  return newDeadline
}

/**
 * 
 * @param {number} frequencyMagnitude
 * @param {FrequencyUnit} frequencyUnit
 * @returns {number}
 */
function getDeadline(frequencyMagnitude, frequencyUnit) {
  return getDeadlineObj(frequencyMagnitude, frequencyUnit).valueOf();
}

/**
 * 
 * @param {number} frequencyMagnitude
 * @param {FrequencyUnit} frequencyUnit
 * @returns {dayjs.Dayjs}
 */
function getDeadlineObj(frequencyMagnitude, frequencyUnit) {
  return dayjs().add(frequencyMagnitude - 1, frequencyUnit).endOf(frequencyUnit);
}

/**
 * 
 * @param {string} magnitude
 * @param {FrequencyUnit} unit 
 * @returns {{ invalidMagnitude: false, value: string } | { invalidMagnitude: true }} 
 */
function formatFrequency(magnitude, unit) {
  const parsedMagnitude = parseFrequencyMagnitude(magnitude);
  if (parsedMagnitude === null) {
    return { invalidMagnitude: true };
  }
  return { invalidMagnitude: false, value: formatFrequencyHelper(parsedMagnitude, unit) };
}

/**
 * 
 * @param {number} magnitude
 * @param {FrequencyUnit} unit 
 * @returns {string} 
 */
function formatFrequencyHelper(magnitude, unit) {
  if (magnitude === 1) {
    switch (unit) {
      case 'hour': return 'Hourly';
      case 'day': return 'Daily';
      case 'week': return 'Weekly';
      case 'month': return 'Monthly';
      case 'year': return 'Yearly';
      default: return `Every ${unit}`;
    }
  }
  return `Every ${magnitude} ${unit}s`;
}

/**
 * 
 * @param {string} magnitude
 * @param {FrequencyUnit} unit 
 * @returns {string}
 */
function formatUnit(magnitude, unit) {
  const parsedMagnitude = parseFrequencyMagnitude(magnitude);
  if (parsedMagnitude === null) {
    return formatUnitHelper(1, unit);
  }
  return formatUnitHelper(parsedMagnitude, unit);
}

/**
 * 
 * @param {number} magnitude
 * @param {FrequencyUnit} unit 
 * @returns {string} 
 */
function formatUnitHelper(magnitude, unit) {
  if (magnitude === 1) {
    return toTitleCase(unit);
  }
  return toTitleCase(unit) + 's';
}

/**
 * 
 * @param {string} magnitude
 * @returns {number | null} 
 */
function parseFrequencyMagnitude(magnitude) {
  const trimmed = magnitude.trim();
  for (const c of trimmed) {
    if (Number.isNaN(Number.parseInt(c))) {
      return null;
    }
  }
  const parsedMagnitude = Number.parseInt(trimmed);
  if (Number.isNaN(parsedMagnitude) || parsedMagnitude < 1) {
    return null;
  }
  return parsedMagnitude;
}

/**
 * 
 * @param {string} s 
 * @returns {string}
 */
function toTitleCase(s) {
  if (s.length === 0) {
    return s;
  }
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * 
 * @returns {Level}
 */
function randomLevel() {
  if (Math.random() < 0.1) {
    return "boss";
  } else {
    return Math.floor(Math.random() * 99) + 1;
  }
}

/**
 * 
 * @param {Level} level 
 * @returns {string} 
 */
function formatLevel(level) {
  if (level === "boss") {
    return "boss";
  } else {
    return "lvl " + padLevelNumber(level);
  }
}

/**
 * 
 * @param {number} level 
 * @returns {string} 
 */
function padLevelNumber(level) {
  return (level < 10) ?
    "0" + level :
    level.toString();
}

/**
 * 
 * @param {{
 *   monster: Monster
 *   monsters: MonsterProps
 *   switchToView: () => void
 * }} props 
 */
function MonsterEdit({ monster, monsters, switchToView }) {
  const name = monsterName(monster);
  /** @type {React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>} */
  function onChangeTaskName(e) {
    monsters.setMonster({
      ...monster,
      taskName: e.target.value,
    });
  }
  /** @type {React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>} */
  function onChangeTask(e) {
    monsters.setMonster({
      ...monster,
      task: e.target.value,
    });
  }
  /** @type {React.ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>} */
  function onChangeMonsterKind(e) {
    const kind = e.target.value;
    if (!isMonsterKind(kind)) {
      return;
    }
    monsters.setMonster({
      ...monster,
      kind,
    });
  }
  /** @type {React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>} */
  function onChangeFrequencyMagnitude(e) {
    const frequencyMagnitude = e.target.value;
    const deadline = tryGetDeadline(frequencyMagnitude, monster.frequencyUnit);
    monsters.setMonster({
      ...monster,
      frequencyMagnitude,
      deadline,
    });
  }
  /** @type {React.ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>} */
  function onChangeFrequencyUnit(e) {
    const frequencyUnit = e.target.value;
    if (!isFrequencyUnit(frequencyUnit)) {
      return;
    }
    const deadline = tryGetDeadline(monster.frequencyMagnitude, frequencyUnit);
    monsters.setMonster({
      ...monster,
      frequencyUnit,
      deadline,
    });
  }

  function deleteMonster() {
    monsters.deleteMonster(monster);
  }
  return (
    <div className="font-sans p-2 bg-slate-700 rounded-sm text-slate-100" key={monster.id}>
      <div className="flex items-start justify-between">
        <div>{name}</div>
        <div className="flex gap-x-1">
          <button onClick={deleteMonster} className="cursor-pointer">
            <span className="material-symbols-outlined text-slate-400">delete</span>
          </button>
          <button onClick={switchToView} className="cursor-pointer">
            <span className="material-symbols-outlined text-slate-400">check</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 mt-1">
        <div className="flex gap-x-2">
          <div className="flex flex-col min-w-0">
            <input className="bg-slate-600 rounded-sm px-2 py-0.5 min-w-0" name='prefix' value={monster.taskName} onChange={onChangeTaskName}/>
            <label className="ml-2 text-slate-400 font-bold text-sm" htmlFor='prefix'>PREFIX</label>
          </div>

          <div className="flex flex-col">
            <select className="bg-slate-600 rounded-sm px-1 py-0.5" name='monster' value={monster.kind} onChange={onChangeMonsterKind}>
              {monsterKinds.map(kind => {
                return (<option key={kind} value={kind}>{kind}</option>);
              })}
            </select>
            <label className="ml-2 text-slate-400 font-bold text-sm" htmlFor='monster'>MONSTER</label>
          </div>
        </div>
        <div className="flex flex-col">
          <input className="bg-slate-600 rounded-sm px-2 py-0.5" name='task' value={monster.task} onChange={onChangeTask} />
          <label className="ml-2 text-slate-400 font-bold text-sm" htmlFor='task'>TASK</label>
        </div>
      </div>
      <div className="flex gap-x-2">
        <div>Every</div>
        <input className="bg-slate-600 rounded-sm px-2 py-0.5 w-[8ch]" name='frequency magnitude' value={monster.frequencyMagnitude} onChange={onChangeFrequencyMagnitude} />
        <select className="bg-slate-600 rounded-sm px-1 py-0.5" name='frequency unit' value={monster.frequencyUnit} onChange={onChangeFrequencyUnit}>
          {frequencyUnits.map(unit => {
            return (<option key={unit} value={unit}>{formatUnit(monster.frequencyMagnitude, unit)}</option>);
          })}
        </select>
      </div>
      {parseFrequencyMagnitude(monster.frequencyMagnitude) === null ?
        <div className="text-red-500">Invalid frequency</div> :
        <></>
      }
    </div>
  );
}

function Header() {
  return (
    <>
      <header className="home-header">
        <Nav />
      </header>
      <header className="home-mini-header">
        <MiniNav />
      </header>
    </>
  );
}

export default Home;
