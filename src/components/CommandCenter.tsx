import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  ShieldCheck, 
  Radio, 
  BookOpen, 
  Terminal, 
  FileText, 
  GraduationCap, 
  Package, 
  Shield, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  Wifi,
  WifiOff,
  Server,
  Zap,
  ArrowRight,
  ChevronRight,
  Smartphone,
  Download
} from 'lucide-react';
import { SystemVitals, ActiveTab, Language } from '../types';
import { NOMAD_CURATED_APPS, SURVIVAL_GUIDES, SurvivalGuide } from '../data/nomadData';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface CommandCenterProps {
  vitals: SystemVitals;
  onNavigate: (tab: ActiveTab) => void;
  lang: Language;
  onSelectGuide: (guide: SurvivalGuide) => void;
  onUpdateServerUrl: (url: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  vitals,
  onNavigate,
  lang,
  onSelectGuide,
  onUpdateServerUrl
}) => {
  const [threatLevel, setThreatLevel] = useState<'NORMAL' | 'ELEVATED' | 'CRITICAL'>('NORMAL');
  const [serverInput, setServerInput] = useState(vitals.serverUrl);
  const [showServerModal, setShowServerModal] = useState(false);
  const [apps, setApps] = useState(NOMAD_CURATED_APPS);
  const { install, isInstalled } = usePWAInstall();

  const toggleAppRun = (appId: string) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, running: !a.running } : a));
  };

  const getThreatBadge = () => {
    switch (threatLevel) {
      case 'CRITICAL':
        return { label: lang === 'pt' ? 'DEFCON 1 - EMERGÊNCIA ATIVA' : 'DEFCON 1 - EMERGENCY', color: 'bg-rose-500/20 text-rose-400 border-rose-500/50' };
      case 'ELEVATED':
        return { label: lang === 'pt' ? 'DEFCON 3 - ALERTA & VIGILÂNCIA' : 'DEFCON 3 - ELEVATED ALERT', color: 'bg-amber-500/20 text-amber-400 border-amber-500/50' };
      default:
        return { label: lang === 'pt' ? 'DEFCON 5 - OPERAÇÃO PADRÃO' : 'DEFCON 5 - NORMAL OPS', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' };
    }
  };

  const threat = getThreatBadge();

  return (
    <div className="space-y-4 pb-20 pt-2 px-3.5 max-w-4xl mx-auto">
      
      {/* 1. Tactical Status Banner */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100 tracking-wide font-mono">
                {lang === 'pt' ? 'CENTRO DE COMANDO NOMAD' : 'NOMAD COMMAND CENTER'}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                v1.35.1
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'pt' 
                ? 'Nó Móvel de Mídia Offline, Arquivos e Dados Táticos' 
                : 'Mobile Node for Offline Media, Archives, and Data'}
            </p>
          </div>

          {/* Threat Level Switcher */}
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${threat.color}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {threat.label}
            </span>
            <button
              onClick={() => {
                const next = threatLevel === 'NORMAL' ? 'ELEVATED' : threatLevel === 'ELEVATED' ? 'CRITICAL' : 'NORMAL';
                setThreatLevel(next);
              }}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono border border-slate-700"
              title="Alterar nível de prontidão tática"
            >
              DEFCON
            </button>
          </div>
        </div>

        {/* 2. System Vitals Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
          {/* CPU */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono">CPU</span>
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold font-mono text-slate-100">{vitals.cpuUsage}%</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${vitals.cpuUsage}%` }} 
                />
              </div>
            </div>
          </div>

          {/* RAM */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono">RAM</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold font-mono text-slate-100">
                {vitals.ramUsedGb} <span className="text-xs font-normal text-slate-400">/ {vitals.ramTotalGb}GB</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${vitals.ramUsagePercent}%` }} 
                />
              </div>
            </div>
          </div>

          {/* NVMe Storage */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono">NVMe / ZFS</span>
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold font-mono text-slate-100">
                {vitals.diskUsedGb} <span className="text-xs font-normal text-slate-400">/ {vitals.diskTotalGb}GB</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((vitals.diskUsedGb / vitals.diskTotalGb) * 100)}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Power & Temp */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono">ENERGIA</span>
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold font-mono text-slate-100">
                {vitals.batteryPercent}% <span className="text-xs font-normal text-slate-400">({vitals.temperatureC}°C)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate font-mono">
                {vitals.isOffgrid ? (lang === 'pt' ? 'Descarga ~9.4h' : 'Discharge ~9.4h') : 'AC Alimentado'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Mobile Installation & APK Card */}
      {!isInstalled && (
        <section className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-xl p-3 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100 font-mono">
                  {lang === 'pt' ? 'INSTALAR APP NO ANDROID' : 'INSTALL ON ANDROID'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">
                  STANDALONE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {lang === 'pt'
                  ? 'Instale direto na tela inicial sem barras de navegador com suporte 100% offline.'
                  : 'Install to your home screen with zero browser bars and full offline support.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={install}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'pt' ? 'Instalar no Celular' : 'Install App'}</span>
            </button>
          </div>
        </section>
      )}

      {/* 3. Quick Action Hub */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            {lang === 'pt' ? 'Módulos Táticos Principais' : 'Core Tactical Modules'}
          </h2>
          <span className="text-[11px] text-amber-400 font-mono">
            {lang === 'pt' ? '6 Prontos para Uso' : '6 Ready for Field'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* AI Assistant Tile */}
          <button
            onClick={() => onNavigate('ai')}
            className="flex flex-col items-start p-3 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-xl transition-all group text-left shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                OLLAMA/RAG
              </span>
            </div>
            <h3 className="mt-2.5 text-sm font-bold text-slate-100 group-hover:text-amber-300">
              {lang === 'pt' ? 'IA Tática & RAG' : 'Tactical AI & RAG'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
              {lang === 'pt' 
                ? 'Consultas locais de primeiros socorros, sobrevivência e documentos.' 
                : 'Local queries for medical triage, survival and vector documents.'}
            </p>
          </button>

          {/* Maps Tile */}
          <button
            onClick={() => onNavigate('maps')}
            className="flex flex-col items-start p-3 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all group text-left shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                PROTOMAPS
              </span>
            </div>
            <h3 className="mt-2.5 text-sm font-bold text-slate-100 group-hover:text-cyan-300">
              {lang === 'pt' ? 'Mapas Offline & GPS' : 'Offline Maps & GPS'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
              {lang === 'pt' 
                ? 'Coordenadas MGRS, Maidenhead, pontos de água e abrigos.' 
                : 'MGRS coordinates, Maidenhead HAM grid, water and shelter waypoints.'}
            </p>
          </button>

          {/* Medical Reference Tile */}
          <button
            onClick={() => onNavigate('medical')}
            className="flex flex-col items-start p-3 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/50 rounded-xl transition-all group text-left shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                FDA + HERBAL
              </span>
            </div>
            <h3 className="mt-2.5 text-sm font-bold text-slate-100 group-hover:text-rose-300">
              {lang === 'pt' ? 'Saúde & Remédios' : 'Medical & Remedies'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
              {lang === 'pt' 
                ? '36 condições, remédios naturais, interações e triagem START.' 
                : '36 conditions, home remedies, drug conflicts and START triage.'}
            </p>
          </button>

          {/* Meshtastic Comms Tile */}
          <button
            onClick={() => onNavigate('mesh')}
            className="flex flex-col items-start p-3 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition-all group text-left shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                LoRa 915MHz
              </span>
            </div>
            <h3 className="mt-2.5 text-sm font-bold text-slate-100 group-hover:text-emerald-300">
              {lang === 'pt' ? 'Comunicação Mesh' : 'Meshtastic Radio'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
              {lang === 'pt' 
                ? 'Transmissão sem internet por ondas de rádio e canal de emergência.' 
                : 'Off-grid decentralized radio packets, channels and SOS broadcast.'}
            </p>
          </button>

          {/* Survival Utilities Tile */}
          <button
            onClick={() => onNavigate('tools')}
            className="flex flex-col items-start p-3 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 rounded-xl transition-all group text-left shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">
                CYBERCHEF
              </span>
            </div>
            <h3 className="mt-2.5 text-sm font-bold text-slate-100 group-hover:text-purple-300">
              {lang === 'pt' ? 'Utilitários & Morse' : 'Survival Utilities'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
              {lang === 'pt' 
                ? 'Emissor Morse com som/luz, calculadora solar e diário de campo.' 
                : 'Morse audio/strobe flasher, solar power runtime, and field notes.'}
            </p>
          </button>

          {/* Supply Depot Tile */}
          <button
            onClick={() => onNavigate('depot')}
            className="flex flex-col items-start p-3 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 rounded-xl transition-all group text-left shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                KIWIX/ZIM
              </span>
            </div>
            <h3 className="mt-2.5 text-sm font-bold text-slate-100 group-hover:text-blue-300">
              {lang === 'pt' ? 'Depósito & Arquivos' : 'Supply Depot & ZIMs'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
              {lang === 'pt' 
                ? 'Wikipedia ZIM offline, Kolibri e catálogo de containers curados.' 
                : 'Kiwix Wikipedia ZIMs, Kolibri academy and curated Docker apps.'}
            </p>
          </button>
        </div>
      </section>

      {/* 4. Curated Apps & Microservices Status */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              {lang === 'pt' ? 'Serviços do Nó NOMAD' : 'NOMAD Node Services'}
            </h2>
          </div>
          <button
            onClick={() => setShowServerModal(true)}
            className="text-[11px] text-slate-400 hover:text-amber-300 font-mono flex items-center gap-1"
          >
            <span>{vitals.serverConnected ? 'Servidor Conectado' : 'Configurar Ponte'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {apps.slice(0, 4).map((app) => (
            <div 
              key={app.id}
              className="flex items-center justify-between p-2.5 bg-slate-950/50 border border-slate-800/80 rounded-lg text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2 h-2 rounded-full ${app.running ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'}`} />
                <div className="truncate">
                  <div className="font-semibold text-slate-200 truncate">{app.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Port :{app.port} • {app.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  app.running 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {app.running ? 'ATIVO' : 'PARADO'}
                </span>
                <button
                  onClick={() => toggleAppRun(app.id)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono border border-slate-700"
                >
                  {app.running ? 'Pausar' : 'Iniciar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Preloaded Survival Guides Drawer */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              {lang === 'pt' ? 'Manuais Críticos Pré-Carregados' : 'Preloaded Field Manuals'}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">100% OFFLINE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SURVIVAL_GUIDES.map((guide) => (
            <button
              key={guide.id}
              onClick={() => onSelectGuide(guide)}
              className="flex items-start gap-2.5 p-2.5 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-lg text-left transition-colors group"
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${guide.priority === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'}`} />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 truncate">
                  {guide.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {guide.summary}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 self-center" />
            </button>
          ))}
        </div>
      </section>

      {/* Server Link Modal */}
      {showServerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-sm w-full p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-100 font-mono flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                {lang === 'pt' ? 'Ponte Servidor NOMAD' : 'NOMAD Server Bridge'}
              </h3>
              <button 
                onClick={() => setShowServerModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-2.5">
              {lang === 'pt'
                ? 'Conecte este cliente mobile a uma máquina Ubuntu/Debian executando o Project NOMAD original na rede local (ex: http://192.168.1.150:8080).'
                : 'Connect this mobile client to an Ubuntu machine running Project NOMAD on your local LAN (e.g. http://192.168.1.150:8080).'}
            </p>

            <div className="mt-3">
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                URL DO SERVIDOR:
              </label>
              <input
                type="text"
                value={serverInput}
                onChange={(e) => setServerInput(e.target.value)}
                placeholder="http://192.168.1.100:8080"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  onUpdateServerUrl(serverInput);
                  setShowServerModal(false);
                }}
                className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs"
              >
                {lang === 'pt' ? 'Salvar & Conectar' : 'Save & Link'}
              </button>
              <button
                onClick={() => setShowServerModal(false)}
                className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs hover:bg-slate-700"
              >
                {lang === 'pt' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
