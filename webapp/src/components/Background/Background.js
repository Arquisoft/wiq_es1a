import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useColorMode } from "@chakra-ui/react";
import "./Background.css";

const Background = () => {
    const [ init, setInit ] = useState(false);
    const { colorMode } = useColorMode();
    const isDarkTheme = colorMode === "dark";
    const particlesColor = isDarkTheme ? "#FFFFFF" : "#000000";
    const bgColor = isDarkTheme ? '#1A202C' : '#FFFFFF';
    
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log(container);
    };
 
    return (
        <>
            { init && <Particles
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={{
                    background: {
                        color: {
                            value: bgColor,
                        },
                    },
                    fpsLimit: 120,
                    particles: {
                        color: {
                            value: particlesColor,
                        },
                        links: {
                            enable: false,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 6,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 80,
                        },
                        opacity: {
                            value: 0.5,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 5 },
                        },
                    },
                    detectRetina: true,
                }}
            />}
        </>
    );
};

export default Background;