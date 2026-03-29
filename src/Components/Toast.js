import React, { useEffect, useState } from 'react';
import '../Styling/Toast.css';

let globalEmit = null;

export function emitToast(message, ms = 2500) {
    if (globalEmit) globalEmit(message, ms);
}

function Toast() {
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        globalEmit = (m, ms) => {
            setMsg(m);
            setTimeout(() => setMsg(null), ms);
        };
        return () => { globalEmit = null; };
    }, []);

    if (!msg) return null;

    return (
        <div className="toast" role="status" aria-live="polite">
            {msg}
        </div>
    );
}

export default Toast;
