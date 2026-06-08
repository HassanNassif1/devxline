import React, { useEffect } from 'react';
import Typewriter from 'typewriter-effect';

const TypewriterComponent = () => {
    useEffect(() => {
        console.log(
            'console.log("%cHello,\\nWe are Co Develop Company,\\nWe specialize in Web and Software Development", "color: #d19a66; font-size: 20px;")'
        );
    }, []);

    return (
        <div>
            <h4>
                <Typewriter
                    options={{
                        strings: [
                            '<span style="color: #8be9fd; font-size: 40px;">console</span>' +  
                            '<span style="color: #f1fa8c; font-size: 40px;">.</span>' +  
                            '<span style="color: #f1fa8c; font-size: 40px;">log</span>' +  
                            '<span style="color: #f1fa8c; font-size: 40px;">( </span>' +  
                            '<span style="color: #d19a66; font-size: 40px;">"Hello,</span><br>' +  
                            '<span style="color: #d19a66; font-size: 40px;">We are Co Develop Company,</span><br>' +  
                            '<span style="color: #d19a66; font-size: 40px;">We specialize in Web and Software Development"</span>' +  
                            '<span style="color: #f1fa8c; font-size: 40px;"> );</span>'
                        ],
                        autoStart: true,
                        loop: true,
                        delay: 20,
                        cursor: "_",
                        pauseFor: 3000,
                        deleteSpeed: 10,
                    }}
                />
            </h4>
        </div>
    );
};

export default TypewriterComponent;
