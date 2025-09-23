import React from "react";
import styles from "./GameScreen.module.css";

export interface GameScreenProps {
  backgroundImageUrl: string;
  characterImageUrl: string;
  characterName: string;
  dialogue: string;
  onClick?: () => void;
  systemMenus?: { key: string; label: string; onClick: () => void }[];
}

const GameScreen: React.FC<GameScreenProps> = ({
  backgroundImageUrl,
  characterImageUrl,
  characterName,
  dialogue,
  onClick,
  systemMenus,
}) => {
  return (
    <div className={styles.root} onClick={onClick}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      />
      <img
        className={styles.characterSprite}
        src={characterImageUrl}
        alt={characterName}
        draggable={false}
      />
      <div className={styles.mainPanel}>
        <div className={styles.nameTag}>{characterName}</div>
        <div className={styles.dialogueText}>{dialogue}</div>
        {systemMenus && (
          <div className={styles.systemMenu}>
            {systemMenus.map((menu) => (
              <button
                key={menu.key}
                className={styles.systemMenuBtn}
                type="button"
                onClick={menu.onClick}
              >
                {menu.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;