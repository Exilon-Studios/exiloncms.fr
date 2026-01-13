import { useState } from 'react';

interface ServerStepProps {
  data: Record<string, any>;
  setData: (data: any) => void;
  settings: Record<string, any>;
}

const SERVER_TYPES = [
  {
    id: 'minecraft-java',
    name: 'Minecraft Java',
    icon: '⛏️',
    description: 'Pour les serveurs Minecraft Java Edition',
    defaultPort: 25565,
  },
  {
    id: 'minecraft-bedrock',
    name: 'Minecraft Bedrock',
    icon: '⛏️',
    description: 'Pour les serveurs Minecraft Bedrock Edition',
    defaultPort: 19132,
  },
  {
    id: 'fivem',
    name: 'FiveM',
    icon: '🚗',
    description: 'Pour les serveurs FiveM GTA V',
    defaultPort: 30120,
  },
];

export function ServerStep({ data, setData, settings }: ServerStepProps) {
  const [selectedType, setSelectedType] = useState(data.type || 'minecraft-java');

  return (
    <div className="space-y-6">
      {/* Server Type Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Type de serveur <span className="text-red-500">*</span>
        </label>
        <div className="grid md:grid-cols-3 gap-3">
          {SERVER_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => {
                setSelectedType(type.id);
                setData({
                  ...data,
                  type: type.id,
                  port: type.defaultPort,
                });
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedType === type.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-border'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{type.icon}</span>
                <span className="font-medium text-foreground">{type.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Server Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Nom du serveur <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="Mon Serveur Survival"
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>

      {/* Server Address */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Adresse du serveur <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.address || ''}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          placeholder="play.mon-serveur.fr"
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Entrez l'adresse IP ou le nom de domaine de votre serveur, sans le port.
        </p>
      </div>

      {/* Server Port */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Port
        </label>
        <input
          type="number"
          value={data.port || SERVER_TYPES.find(t => t.id === selectedType)?.defaultPort || 25565}
          onChange={(e) => setData({ ...data, port: parseInt(e.target.value) })}
          placeholder="25565"
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Le port par défaut est {SERVER_TYPES.find(t => t.id === selectedType)?.defaultPort}.
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-muted/30 border border-border rounded-lg">
        <div className="flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <div>
            <p className="text-sm font-medium text-foreground">Pourquoi connecter un serveur ?</p>
            <p className="text-xs text-muted-foreground mt-1">
              Une fois connecté, votre site affichera le statut en temps réel, le nombre de joueurs connectés et permettra aux joueurs de voir les informations du serveur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
