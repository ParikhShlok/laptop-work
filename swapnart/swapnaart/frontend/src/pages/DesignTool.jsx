import React, { useState, useEffect } from 'react';
import { 
  Type, Square, Circle, Image as ImageIcon, Download, Save, 
  Trash2, Undo, Redo, Copy, ArrowUp, ArrowDown, Grid, Layout
} from 'lucide-react';
import axios from 'axios';

const DesignTool = () => {
  // Templates configuration
  const templates = [
    { name: 'Business Card', width: 500, height: 300, preview: '🎴' },
    { name: 'Flex Banner', width: 600, height: 250, preview: '🖼️' },
    { name: 'Letterhead', width: 450, height: 550, preview: '📄' }
  ];

  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [bgColor, setBgColor] = useState('#ffffff');
  
  // Design Layers State
  const [layers, setLayers] = useState([
    { id: '1', type: 'text', text: 'SWAPNAART Agency', x: 100, y: 80, width: 250, height: 40, color: '#6C3BFF', fontSize: 24, fontStyle: 'Poppins' },
    { id: '2', type: 'rect', x: 50, y: 150, width: 400, height: 4, color: '#FF4D8D' }
  ]);
  
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  
  // Undo/Redo Stacks
  const [history, setHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [layerStartPos, setLayerStartPos] = useState({ x: 0, y: 0 });

  // Save/Load status
  const [draftTitle, setDraftTitle] = useState('Visiting Card Draft');
  const [saveStatus, setSaveStatus] = useState('');

  // Save current state to history for undo/redo
  const pushStateToHistory = (newLayers) => {
    const nextHistory = history.slice(0, historyPointer + 1);
    nextHistory.push(JSON.stringify(newLayers));
    
    // Limit stack size
    if (nextHistory.length > 20) nextHistory.shift();
    
    setHistory(nextHistory);
    setHistoryPointer(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyPointer > 0) {
      const prevPointer = historyPointer - 1;
      setLayers(JSON.parse(history[prevPointer]));
      setHistoryPointer(prevPointer);
    }
  };

  const handleRedo = () => {
    if (historyPointer < history.length - 1) {
      const nextPointer = historyPointer + 1;
      setLayers(JSON.parse(history[nextPointer]));
      setHistoryPointer(nextPointer);
    }
  };

  // Add Layer Helper
  const addLayer = (type) => {
    let newLayer = {};
    const id = Date.now().toString();

    if (type === 'text') {
      newLayer = {
        id,
        type: 'text',
        text: 'Editable Text',
        x: 50,
        y: 100,
        width: 150,
        height: 30,
        color: '#161616',
        fontSize: 16,
        fontStyle: 'Poppins'
      };
    } else if (type === 'rect') {
      newLayer = {
        id,
        type: 'rect',
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        color: '#00D2FF'
      };
    } else if (type === 'circle') {
      newLayer = {
        id,
        type: 'circle',
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        color: '#6C3BFF'
      };
    }

    const updatedLayers = [...layers, newLayer];
    setLayers(updatedLayers);
    setSelectedLayerId(id);
    pushStateToHistory(updatedLayers);
  };

  // Upload graphic helper
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newLayer = {
        id: Date.now().toString(),
        type: 'image',
        src: event.target.result,
        x: 50,
        y: 50,
        width: 150,
        height: 150
      };
      const updated = [...layers, newLayer];
      setLayers(updated);
      setSelectedLayerId(newLayer.id);
      pushStateToHistory(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleLayerPropChange = (id, prop, val) => {
    const updated = layers.map(layer => {
      if (layer.id === id) {
        return { ...layer, [prop]: val };
      }
      return layer;
    });
    setLayers(updated);
    // Don't push to history for mouse drag moves immediately, but push for input revisions
    if (prop !== 'x' && prop !== 'y') {
      pushStateToHistory(updated);
    }
  };

  // Drag and Drop Logic
  const handleMouseDown = (e, layer) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    
    setSelectedLayerId(layer.id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setLayerStartPos({ x: layer.x, y: layer.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedLayerId) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    const updated = layers.map(l => {
      if (l.id === selectedLayerId) {
        return {
          ...l,
          x: Math.round(layerStartPos.x + dx),
          y: Math.round(layerStartPos.y + dy)
        };
      }
      return l;
    });
    setLayers(updated);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      pushStateToHistory(layers);
    }
  };

  const deleteSelectedLayer = () => {
    if (!selectedLayerId) return;
    const filtered = layers.filter(l => l.id !== selectedLayerId);
    setLayers(filtered);
    setSelectedLayerId(null);
    pushStateToHistory(filtered);
  };

  const duplicateSelectedLayer = () => {
    const active = layers.find(l => l.id === selectedLayerId);
    if (!active) return;

    const dup = {
      ...active,
      id: Date.now().toString(),
      x: active.x + 20,
      y: active.y + 20
    };
    const updated = [...layers, dup];
    setLayers(updated);
    setSelectedLayerId(dup.id);
    pushStateToHistory(updated);
  };

  // Layer Reordering depth adjustment
  const moveLayerDepth = (direction) => {
    const index = layers.findIndex(l => l.id === selectedLayerId);
    if (index === -1) return;

    const updated = [...layers];
    if (direction === 'up' && index < layers.length - 1) {
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
    } else if (direction === 'down' && index > 0) {
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
    }
    setLayers(updated);
    pushStateToHistory(updated);
  };

  // Compile offscreen HTML5 Canvas and download PNG
  const handleExportPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = activeTemplate.width;
    canvas.height = activeTemplate.height;
    const ctx = canvas.getContext('2d');

    // 1. Draw Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Layers sequentially
    let loadedImagesCount = 0;
    const imageLayers = layers.filter(l => l.type === 'image');
    
    const triggerDownload = () => {
      const link = document.createElement('a');
      link.download = `${draftTitle.toLowerCase().replace(/ /g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    const drawVisuals = () => {
      layers.forEach(layer => {
        if (layer.type === 'rect') {
          ctx.fillStyle = layer.color;
          ctx.fillRect(layer.x, layer.y, layer.width, layer.height);
        } else if (layer.type === 'circle') {
          ctx.beginPath();
          ctx.fillStyle = layer.color;
          ctx.arc(layer.x + layer.width / 2, layer.y + layer.height / 2, layer.width / 2, 0, 2 * Math.PI);
          ctx.fill();
        } else if (layer.type === 'text') {
          ctx.fillStyle = layer.color;
          ctx.font = `${layer.fontSize}px ${layer.fontStyle || 'Arial'}`;
          ctx.textBaseline = 'top';
          ctx.fillText(layer.text, layer.x, layer.y);
        } else if (layer.type === 'image') {
          const img = layer.imageElement;
          if (img) {
            ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height);
          }
        }
      });
      triggerDownload();
    };

    // Preload image elements to avoid blank drawings
    if (imageLayers.length === 0) {
      drawVisuals();
    } else {
      imageLayers.forEach(l => {
        const img = new Image();
        img.src = l.src;
        img.onload = () => {
          l.imageElement = img;
          loadedImagesCount++;
          if (loadedImagesCount === imageLayers.length) {
            drawVisuals();
          }
        };
      });
    }
  };

  // Sync draft to database API
  const handleSaveDraft = async () => {
    setSaveStatus('Saving design workspace...');
    try {
      const payload = {
        title: draftTitle,
        canvasData: {
          layers,
          bgColor,
          activeTemplate
        }
      };
      await axios.post('/api/designs', payload);
      setSaveStatus('Draft workspace saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('Save failed. Access admin permission.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Load first state
  useEffect(() => {
    setHistory([JSON.stringify(layers)]);
    setHistoryPointer(0);
  }, []);

  const activeLayer = layers.find(l => l.id === selectedLayerId);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-poppins text-left flex flex-col h-[85vh]">
      
      {/* Editor top header details */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <span>🎨 Canva-like Admin Design Editor</span>
          </h1>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            className="bg-transparent border-b border-dashed border-gray-400 font-medium text-xs focus:border-primary outline-none py-0.5 mt-1 font-inter text-gray-600"
          />
        </div>

        {/* Undo Redo & Action CTAs */}
        <div className="flex items-center space-x-3 text-xs">
          <button 
            disabled={historyPointer <= 0}
            onClick={handleUndo} 
            className="p-2 bg-white rounded-xl border border-gray-150 hover:bg-gray-50 text-gray-500 disabled:opacity-30"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button 
            disabled={historyPointer >= history.length - 1}
            onClick={handleRedo} 
            className="p-2 bg-white rounded-xl border border-gray-150 hover:bg-gray-50 text-gray-500 disabled:opacity-30"
          >
            <Redo className="w-4 h-4" />
          </button>

          <button
            onClick={handleSaveDraft}
            className="bg-white border border-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl flex items-center space-x-1 hover:border-primary transition-all"
          >
            <Save className="w-4 h-4 text-primary" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handleExportPNG}
            className="bg-primary hover:bg-secondary text-white font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-premium"
          >
            <Download className="w-4 h-4" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <p className="text-[10px] text-green-600 font-bold mb-4 font-inter text-center animate-pulse">{saveStatus}</p>
      )}

      {/* Editor grid container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Left Toolbar Toolbox */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-gray-150 shadow-premium flex flex-col space-y-6 overflow-y-auto">
          
          {/* Section 1: Template Size */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-primary" />
              <span>Dimension templates</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {templates.map((temp) => (
                <button
                  key={temp.name}
                  onClick={() => {
                    setActiveTemplate(temp);
                    setSelectedLayerId(null);
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-between text-[10px] font-bold transition-all ${
                    activeTemplate.name === temp.name
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-150 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{temp.preview}</span>
                  <span className="mt-1 font-inter text-[8px] truncate">{temp.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Drawing Tools */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 text-xs">Add canvas layers</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => addLayer('text')}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-150 p-3 rounded-xl flex items-center space-x-1.5 font-medium transition-colors"
              >
                <Type className="w-4 h-4 text-primary" />
                <span>Text Layer</span>
              </button>
              <button
                onClick={() => addLayer('rect')}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-150 p-3 rounded-xl flex items-center space-x-1.5 font-medium transition-colors"
              >
                <Square className="w-4 h-4 text-secondary" />
                <span>Rect Layer</span>
              </button>
              <button
                onClick={() => addLayer('circle')}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-150 p-3 rounded-xl flex items-center space-x-1.5 font-medium transition-colors"
              >
                <Circle className="w-4 h-4 text-accent" />
                <span>Circle Layer</span>
              </button>
              
              {/* Image upload trigger */}
              <label className="bg-gray-50 hover:bg-gray-100 border border-gray-150 p-3 rounded-xl flex items-center space-x-1.5 font-medium transition-colors cursor-pointer justify-center">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <ImageIcon className="w-4 h-4 text-green-600" />
                <span>Upload Logo</span>
              </label>
            </div>
          </div>

          {/* Section 3: Canvas Backdrop Color */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-600 block">Canvas Background Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 border border-gray-200 rounded-xl cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono font-medium text-gray-500 uppercase">{bgColor}</span>
            </div>
          </div>

          {/* Section 4: Selection editor controls */}
          {activeLayer && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-800 text-xs capitalize">Modify {activeLayer.type} Layer</h4>
                <div className="flex space-x-1">
                  <button onClick={duplicateSelectedLayer} className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg"><Copy className="w-3.5 h-3.5" /></button>
                  <button onClick={() => moveLayerDepth('up')} className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg"><ArrowUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => moveLayerDepth('down')} className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg"><ArrowDown className="w-3.5 h-3.5" /></button>
                  <button onClick={deleteSelectedLayer} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {/* Position Coordinates */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-400">Position X (px)</label>
                  <input
                    type="number"
                    value={activeLayer.x}
                    onChange={(e) => handleLayerPropChange(activeLayer.id, 'x', Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-150 rounded-lg p-1.5 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-400">Position Y (px)</label>
                  <input
                    type="number"
                    value={activeLayer.y}
                    onChange={(e) => handleLayerPropChange(activeLayer.id, 'y', Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-150 rounded-lg p-1.5 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-400">Width (px)</label>
                  <input
                    type="number"
                    value={activeLayer.width}
                    onChange={(e) => handleLayerPropChange(activeLayer.id, 'width', Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-150 rounded-lg p-1.5 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-400">Height (px)</label>
                  <input
                    type="number"
                    value={activeLayer.height}
                    onChange={(e) => handleLayerPropChange(activeLayer.id, 'height', Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-150 rounded-lg p-1.5 font-mono"
                  />
                </div>
              </div>

              {/* Text specifics editing */}
              {activeLayer.type === 'text' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-400">Text Content</label>
                    <input
                      type="text"
                      value={activeLayer.text}
                      onChange={(e) => handleLayerPropChange(activeLayer.id, 'text', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-150 rounded-lg p-2 font-inter"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-400">Font Size (px)</label>
                      <input
                        type="number"
                        value={activeLayer.fontSize}
                        onChange={(e) => handleLayerPropChange(activeLayer.id, 'fontSize', Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-150 rounded-lg p-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-400">Font Style</label>
                      <select
                        value={activeLayer.fontStyle}
                        onChange={(e) => handleLayerPropChange(activeLayer.id, 'fontStyle', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-150 rounded-lg p-1.5"
                      >
                        <option value="Poppins">Poppins</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Element Color */}
              {activeLayer.type !== 'image' && (
                <div className="space-y-2">
                  <label className="text-[9px] text-gray-400 block">Element Fill Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={activeLayer.color}
                      onChange={(e) => handleLayerPropChange(activeLayer.id, 'color', e.target.value)}
                      className="w-10 h-10 border border-gray-200 rounded-xl cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono font-medium text-gray-500 uppercase">{activeLayer.color}</span>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Central Workspace Board */}
        <div className="lg:col-span-3 bg-gray-100 rounded-3xl p-6 flex items-center justify-center relative overflow-hidden select-none">
          
          {/* Subtle Grid underlay lines */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#161616_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Draggable Canvas container */}
          <div
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="relative shadow-2xl transition-all duration-300 border border-gray-200/50"
            style={{
              width: `${activeTemplate.width}px`,
              height: `${activeTemplate.height}px`,
              backgroundColor: bgColor,
              overflow: 'hidden'
            }}
          >
            {layers.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              
              return (
                <div
                  key={layer.id}
                  onMouseDown={(e) => handleMouseDown(e, layer)}
                  className={`absolute cursor-move select-none ${
                    isSelected ? 'ring-2 ring-primary ring-offset-1' : ''
                  }`}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: layer.width ? `${layer.width}px` : 'auto',
                    height: layer.height ? `${layer.height}px` : 'auto',
                    zIndex: layers.indexOf(layer)
                  }}
                >
                  
                  {/* Layer types render details */}
                  {layer.type === 'rect' && (
                    <div 
                      className="w-full h-full"
                      style={{ backgroundColor: layer.color }}
                    />
                  )}

                  {layer.type === 'circle' && (
                    <div 
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: layer.color }}
                    />
                  )}

                  {layer.type === 'text' && (
                    <span 
                      className="block select-none whitespace-nowrap"
                      style={{ 
                        color: layer.color,
                        fontSize: `${layer.fontSize}px`,
                        fontFamily: layer.fontStyle || 'sans-serif'
                      }}
                    >
                      {layer.text}
                    </span>
                  )}

                  {layer.type === 'image' && (
                    <img
                      src={layer.src}
                      alt="uploaded element"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};

export default DesignTool;
