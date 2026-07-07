export default function AppBackground() {
  return (
    <div className="app-background" aria-hidden="true">
      <svg
        className="app-background__grid"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 640"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="small-grid"
            patternUnits="userSpaceOnUse"
            width="2"
            height="2"
            viewBox="0 0 2 2"
          >
            <rect
              x="-0.5"
              y="-0.5"
              width="2"
              height="2"
              className="app-background__minor-line"
            />
          </pattern>

          <pattern
            id="big-grid"
            patternUnits="userSpaceOnUse"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <rect
              x="-0.5"
              y="-0.5"
              width="16"
              height="16"
              fill="url(#small-grid)"
              className="app-background__major-line"
            />
          </pattern>
        </defs>

        <rect x="-0.5" y="-0.5" width="1030" height="650" fill="url(#big-grid)" />

        <g className="app-background__edge-lines">
          <path d="M64 0V640M112 0V640M912 0V640M960 0V640" />
          <path d="M0 96H192M0 224H160M0 448H192M832 160H1024M864 352H1024M800 544H1024" />
        </g>

        <g className="app-background__accent">
          <circle cx="64" cy="96" r="0.9" />
          <circle cx="112" cy="224" r="0.85" />
          <circle cx="160" cy="448" r="0.8" />
          <circle cx="192" cy="128" r="0.75" />
          <circle cx="832" cy="160" r="0.8" />
          <circle cx="864" cy="352" r="0.85" />
          <circle cx="912" cy="448" r="0.8" />
          <circle cx="960" cy="544" r="0.9" />
        </g>

        <g className="app-background__accent app-background__accent--float">
          <circle cx="96" cy="384" r="0.7" />
          <circle cx="224" cy="560" r="0.65" />
          <circle cx="800" cy="96" r="0.65" />
          <circle cx="944" cy="288" r="0.7" />
        </g>
      </svg>
    </div>
  );
}
