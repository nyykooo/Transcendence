import { useEffect, useRef } from "react";

import Phaser from "phaser";
import MountainScene from "./game/MountainScene";

export default function Canvas () {
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (gameRef.current) return;
        
        gameRef.current = new Phaser.Game({
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scene: [MountainScene],
            parent: "phaser-container",
            backgroundColor: "#FFFFFF",
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {
                        y: 0,
                        x: 0
                     },
                    debug: false
                }
            }
        });
        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        }
    }, []);

    return <div id="phaser-container" />;
}
