import { useState } from "react";
import { isMonsterKind, monsterKinds, monsterName, randomMonsterKind } from "./types";
import logo from "./assets/logo.png";
import MiniNav from "./MiniNav";
import Nav from "./Nav";
/** @import { Monster } from "./types" */

function Home() {
  const [task, setTask] = useState("");
  const [monsters, setMonsters] = useState(/** @type {Monster[]} */ ([]));

  /** @type {React.SubmitEventHandler<HTMLFormElement>} */
  function onSubmitTask(e) {
    e.preventDefault();

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
    setMonsters([
      ...monsters,
      {
        id,
        taskName,
        kind: monsterKind,
        maxHp: 10,
        currentHp: 0,
        task,
        level: 10
      }
    ]);
    setTask("");
  }
  /** @type {React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>} */
  function onChangeTask(e) {
    setTask(e.target.value);
  }
  return (
    <>
      <title>Task Slayer</title>
      <Header />
      <div className="hero">
        <img className="hero-logo" alt="logo" src={logo} />
        <div className="hero-heading">Task Slayer</div>
        <div className="hero-subheading">Finish tasks. Slay monsters. Level up.</div>
      </div>
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
            {monsters.map(m => {
              const name = monsterName(m);
              /** @type {React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>} */
              function onChangeTaskName(e) {
                setMonsters(monsters.map(x => {
                  if (x.id === m.id) {
                    return {
                      ...m,
                      taskName: e.target.value,
                    };
                  } else {
                    return m;
                  }
                }));
              }
              /** @type {React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>} */
              function onChangeTask(e) {
                setMonsters(monsters.map(x => {
                  if (x.id === m.id) {
                    return {
                      ...m,
                      task: e.target.value,
                    };
                  } else {
                    return m;
                  }
                }));
              }
              /** @type {React.ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>} */
              function onChangeMonsterKind(e) {
                const kind = e.target.value;
                if (!isMonsterKind(kind)) {
                  return;
                }
                setMonsters(monsters.map(x => {
                  if (x.id === m.id) {
                    return {
                      ...m,
                      kind,
                    };
                  } else {
                    return m;
                  }
                }));
              }
              
              return (<div className="font-sans p-2 bg-slate-700 rounded-sm text-slate-100" key={m.id}>
                <div className="flex flex-col gap-y-2">
                  <div>{name} - {m.task}</div>
                  <div className="flex gap-x-2">
                    <div className="flex flex-col min-w-0">
                      <input className="bg-slate-600 rounded-sm px-2 py-0.5 min-w-0" name='prefix' value={m.taskName} onChange={onChangeTaskName}/>
                      <label className="ml-2 text-slate-400 font-bold text-sm" htmlFor='prefix'>PREFIX</label>
                    </div>

                    <div className="flex flex-col">
                      <select className="bg-slate-600 rounded-sm px-1 py-0.5" name='monster' value={m.kind} onChange={onChangeMonsterKind}>
                        {monsterKinds.map(kind => {
                          return (<option key={kind} value={kind}>{kind}</option>);
                        })}
                      </select>
                      <label className="ml-2 text-slate-400 font-bold text-sm" htmlFor='monster'>MONSTER</label>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <input className="bg-slate-600 rounded-sm px-2 py-0.5" name='monster' value={m.task} onChange={onChangeTask} />
                    <label className="ml-2 text-slate-400 font-bold text-sm" htmlFor='monster'>TASK</label>
                  </div>
                </div>
              </div>);
            })}
          </div>
        </div>
      </div>
    </>
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
