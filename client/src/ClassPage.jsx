import { useContext, useEffect, useState } from "react"
import warriorImage from "./assets/warrior.webp";
import scholarImage from "./assets/scholar.png";
import bardImage from "./assets/bard.webp";
import monkImage from "./assets/monk.jpg";
import chevronLeft from "./assets/chevron-left.svg";
import { defaultClass, isClass, nextClass, prevClass } from "./types";
import logo from "./assets/logo.png";
import { Link } from "react-router-dom";
import MiniNav from "./MiniNav";
import Nav from "./Nav";
import { GuestIdContext } from "./GuestIdContext";
import { get, post } from "./requests";
/** @import { Class } from "./types" */

function ClassPage() {
  const [playerClass, setPlayerClass] = useState(/** @type {Class | null} */ (null));
  const [displayedClass, setDisplayedClass] = useState(defaultClass);
  const guestId = useContext(GuestIdContext);
  useEffect(() => {
    get("/api/profile/", guestId)
      .then(data => {
        const class_ = data?.profile?.class_;
        if (isClass(class_)) {
          setPlayerClass(class_);
          setDisplayedClass(class_);
        }
      });
  }, []);
  async function onClickSelect() {
    await post("/api/class", guestId, {
      class_: displayedClass
    });
    // await fetch("/api/class", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     class_: displayedClass
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // });
    setPlayerClass(displayedClass);
  }
  const onClickPrevClass = () => {
    setDisplayedClass(prevClass(displayedClass));
  }
  const onClickNextClass = () => {
    setDisplayedClass(nextClass(displayedClass));
  }
  const formattedClass = `The ${displayedClass}`;
  return (
    <>
      <title>Select Class - Task Slayer</title>
      <Header />
      <div className="class-page-container">
        <h1 className="class-page-mini-heading">Select Class</h1>
        <div className="class-page-main">
          <button onClick={onClickPrevClass} className="class-page-change-class-button">
            <img alt="left arrow" src={chevronLeft}></img>
          </button>
          <ClassImage class_={displayedClass} />
          <button onClick={onClickNextClass} className="class-page-change-class-button">
            <img className="class-page-change-class-button-right-img" alt="right arrow" src={chevronLeft}></img>
          </button>
        </div>
        <h2 className="class-page-class-name" >{formattedClass}</h2>
        {displayedClass === playerClass ?
          <button className="class-page-selected-indicator" disabled>
            Selected
          </button> :
          <button className="class-page-select-button" onClick={onClickSelect}>Select</button>
        }
      </div>      
    </>
  );
}

function Header() {
  return (
    <>
      <header className="class-page-header">
        <div className="header-link-container">
          <Link className="header-link" to="/">
            <img className="logo" alt="logo" src={logo} />
          </Link>
        </div>
        <h1 className="class-page-heading">Select Class</h1>
        <Nav />
      </header>
      <header className="class-page-mini-header">
        <Link className="mini-header-link" to="/">
          <img className="logo" alt="logo" src={logo} />
        </Link>
        <MiniNav />
      </header>
    </>
  );
}

/**
 * 
 * @param {{ class_: Class | null }} props 
 */
function ClassImage({ class_ }) {
  return (
    <>
      {class_ === null ?
        <div>Loading...</div> :
        <img className="class-page-class-image" src={imageSrcFromClass(class_)}></img>
      }
    </>
  );
}

/**
 * 
 * @param {Class} class_ 
 */
function imageSrcFromClass(class_) {
  switch (class_) {
    case "Warrior": return warriorImage;
    case "Scholar": return scholarImage;
    case "Bard": return bardImage;
    case "Monk": return monkImage;
  }
}

export default ClassPage;
