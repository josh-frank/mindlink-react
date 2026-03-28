import { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';
import Meter from './Meter';
import Knob from './Knob';
import EMeterScale from './EMeterScale';

// ─────────────────────────────────────────────────────────────────────────────
//  Constants — mirror v0 defaults
// ─────────────────────────────────────────────────────────────────────────────
const WS_URL          = 'ws://192.168.4.1:5000';
const WS_RECONNECT_MS = 2000;

const METER_MIN        = 0;
const METER_MAX        = 100;
const METER_MID        = (METER_MAX - METER_MIN) / 2;  // 50 — needle resting point

const TONE_ARM_MIN     = 0.0;
const TONE_ARM_MAX     = 1.0;
const TONE_ARM_DEFAULT = 0.5;

const SENSITIVITY_MIN     = 1;
const SENSITIVITY_MAX     = 16;
const SENSITIVITY_DEFAULT = 8;

// ─────────────────────────────────────────────────────────────────────────────
//  norm → meter value
//  norm is 0..1 (v0 formula), mapped into [METER_MIN, METER_MAX]
// ─────────────────────────────────────────────────────────────────────────────
function normToMeterValue(norm) {
  return METER_MIN + norm * (METER_MAX - METER_MIN);
}

// ─────────────────────────────────────────────────────────────────────────────
//  App
// ─────────────────────────────────────────────────────────────────────────────
function App() {

  // Knob state — kept separate so they don't fight each other
  const [toneArm,     setToneArm]     = useState(TONE_ARM_DEFAULT);
  const [sensitivity, setSensitivity] = useState(SENSITIVITY_DEFAULT);

  // Live refs so the WS closure always reads the latest knob values
  // without needing to reconnect on every knob turn
  const toneArmRef     = useRef(toneArm);
  const sensitivityRef = useRef(sensitivity);
  useEffect(() => { toneArmRef.current     = toneArm;     }, [toneArm]);
  useEffect(() => { sensitivityRef.current = sensitivity; }, [sensitivity]);

  // Meter driven value
  const [meterValue, setMeterValue] = useState(METER_MID);

  // Latest raw frame (for debug readout) + connection status
  const [frame,    setFrame]    = useState(null);
  const [wsStatus, setWsStatus] = useState('disconnected'); // 'live' | 'disconnected' | 'error'

  // ── WebSocket connection ───────────────────────────────────────────────────
  useEffect(() => {
    let ws        = null;
    let reconnect = null;
    let dead      = false;

    function connect() {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        if (!dead) setWsStatus('live');
      };

      ws.onclose = () => {
        if (dead) return;
        setWsStatus('disconnected');
        reconnect = setTimeout(connect, WS_RECONNECT_MS);
      };

      ws.onerror = () => {
        if (!dead) setWsStatus('error');
      };

      ws.onmessage = ({ data }) => {
        if (dead) return;
        try {
          const f = JSON.parse(data);
          setFrame(f);

          // ── v0 needle formula ──────────────────────────────────────────
          // norm = toneArm + (delta / sensitivity) * 0.5, clamped 0..1
          let norm = toneArmRef.current + (f.delta / sensitivityRef.current) * 0.5;
          norm     = Math.max(0, Math.min(1, norm));
          setMeterValue(normToMeterValue(norm));
        } catch (_) { /* malformed frame — skip */ }
      };
    }

    connect();
    return () => {
      dead = true;
      clearTimeout(reconnect);
      ws?.close();
    };
  }, []); // stable — knob values read via refs

  // ── knob setState shims ───────────────────────────────────────────────────
  // Knob calls setState as an updater: setState(prev => ({ ...prev, value: newValue }))
  // These shims unwrap that pattern and forward just the value to each knob's own setter.
  const setToneArmKnobState = useCallback(
    (updater) => setToneArm(prev => updater({ value: prev }).value),
    []
  );
  const setSensKnobState = useCallback(
    (updater) => setSensitivity(prev => updater({ value: prev }).value),
    []
  );

  // ── render ────────────────────────────────────────────────────────────────
  return <>

    {/* ── debug readout ── */}
    <div style={{
      position: 'absolute', top: 10, right: 10,
      padding: 8, borderRadius: 8,
      background: 'rgba(0,0,0,0.35)',
      color: 'white', fontFamily: 'monospace', fontSize: 12,
      maxWidth: 520, whiteSpace: 'pre-wrap',
    }}>
      {wsStatus !== 'live'
        ? `WS: ${wsStatus}`
        : frame
          ? JSON.stringify(frame)
          : 'Waiting for frame...'}
    </div>

    {/* ── meter ── */}
    <div style={{
      position: 'absolute', bottom: 0, right: 0,
      transform: 'translate(10, 10)',
      height: '800px', width: '800px',
    }}>
      <Meter
        value={meterValue}
        min={METER_MIN}
        max={METER_MAX}
        startAngle={-180}
        endAngle={90}
        numMarks={101}
        highlightEveryNth={10}
        viewbox='-45 -45 80 80'
        MeterScaleComponent={EMeterScale}
      />
    </div>

    {/* ── sensitivity knob ── */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0,
      height: '250px', width: '250px',
    }}>
      <Knob
        value={sensitivity}
        min={SENSITIVITY_MIN}
        max={SENSITIVITY_MAX}
        label='Sensitivity'
        continuous={false}
        startAngle={-140}
        endAngle={140}
        numMarks={15}
        highlightEveryNth={2}
        setState={setSensKnobState}
      />
    </div>

    {/* ── tone arm knob ── */}
    <div style={{
      position: 'absolute', top: 0, left: 0,
      height: '500px', width: '500px',
    }}>
      <Knob
        value={toneArm}
        min={TONE_ARM_MIN}
        max={TONE_ARM_MAX}
        label='Tone arm'
        continuous={false}
        startAngle={-140}
        endAngle={140}
        numMarks={15}
        highlightEveryNth={2}
        setState={setToneArmKnobState}
      />
    </div>

  </>;
}

export default App;

//         HAGGARD
//      ELECTROMETER
// FOR USE IN SHENANIGANS
// AMERICAN - MARK 0-POLO