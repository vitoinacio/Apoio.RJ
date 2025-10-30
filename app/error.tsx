"use client";

const Error = () => {
  return (
    <main className="w-full h-dvh px-[5%] relative top-0">
      <div className="h-dvh flex items-center">
        <div className="flex-1 flex justify-end mr-10">
          <svg
            className="w-94"
            viewBox="0 0 160 160"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Ilustração de instabilidade no mapa"
          >
            <defs>
              <linearGradient id="gradPin" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient id="gradAlert" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            <circle cx="80" cy="80" r="72" fill="#e0f2fe" />

            <path
              d="M80 28c-16.6 0-30 13.4-30 30 0 20.8 23.9 48 28.1 52.5a2.7 2.7 0 0 0 3.8 0C86.1 106 110 78.8 110 58c0-16.6-13.4-30-30-30Z"
              fill="url(#gradPin)"
            />
            <circle cx="80" cy="58" r="12" fill="white" />

            <g transform="translate(100,100)">
              <circle cx="0" cy="0" r="18" fill="url(#gradAlert)" />
              <rect
                x="-1.8"
                y="-10"
                width="3.6"
                height="9"
                rx="1.8"
                fill="#fff"
              />
              <rect
                x="-1.8"
                y="2.8"
                width="3.6"
                height="3.6"
                rx="1.8"
                fill="#fff"
              />
            </g>

            <g opacity=".25">
              <circle cx="80" cy="126" r="18" fill="#93c5fd" />
              <ellipse
                cx="80"
                cy="126"
                rx="32"
                ry="6"
                fill="#93c5fd"
                opacity=".6"
              />
            </g>
          </svg>
        </div>
        <div className="flex flex-col flex-1 text-xl text-gray-700 gap-10">
          <h2 className="font-bold text-2xl">
            Estamos passando por instabilidades
          </h2>
          <div>
            <p>
              Os pontos de apoio podem demorar para carregar ou ficar
              temporariamente indisponíveis.
            </p>
          </div>
          <div>
            <p>
              Nossa equipe já foi notificada. Enquanto isso, mantenha-se em
              segurança e tente novamente em alguns minutos.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Error;
