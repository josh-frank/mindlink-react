import { useEffect, useState } from 'react';
import './App.css';
import Meter from './Meter';
import Knob from './Knob';
import EMeterScale from './EMeterScale';

function App() {

  const [state, setState] = useState({
    min: 0,
    max: 100,
    value: 50,
  });

  const [frame, setFrame] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const FRAME_URL = 'http://192.168.4.1:5001/frame';

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    async function poll() {
      try {
        setFetchError(null);
        const res = await fetch(FRAME_URL, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (!cancelled) setFrame(data);
      } catch (e) {
        if (!cancelled) setFetchError(e?.message || String(e));
      } finally {
        if (!cancelled) timer = window.setTimeout(poll, 100);
      }
    }

    poll();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return <>
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 8,
      borderRadius: 8,
      background: 'rgba(0,0,0,0.35)',
      color: 'white',
      fontFamily: 'monospace',
      fontSize: 12,
      maxWidth: 520,
      whiteSpace: 'pre-wrap',
    }}>
      {fetchError
        ? `Fetch error: ${fetchError}`
        : frame
          ? JSON.stringify(frame)
          : 'Waiting for frame...'}
    </div>

    <div style={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      transform: 'translate(10, 10)',
      height: '800px',
      width: '800px',
    }}>
      <Meter
        value={state.value}
        min={state.min}
        max={state.max}
        startAngle={-180}
        endAngle={90}
        numMarks={101}
        highlightEveryNth={10}
        viewbox='-45 -45 80 80'
        MeterScaleComponent={EMeterScale}
      />
    </div>

    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: '250px',
      width: '250px',
    }}>
      <Knob
        value={state.value}
        min={state.min}
        max={state.max}
        step={state.step}
        label='Sensitivity'
        continuous={false}
        startAngle={-140}
        endAngle={140}
        numMarks={15}
        highlightEveryNth={2}
        setState={setState}
      />
    </div>

    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      height: '500px',
      width: '500px',
    }}>
      <Knob
        value={state.value}
        min={state.min}
        max={state.max}
        step={state.step}
        label='Tone arm'
        continuous={false}
        startAngle={-140}
        endAngle={140}
        numMarks={15}
        highlightEveryNth={2}
        setState={setState}
      />
    </div>

  </>;

}

export default App

//         HAGGARD
//      ELECTROMETER
// FOR USE IN SHENANIGANS
// AMERICAN - MARK 0-POLO