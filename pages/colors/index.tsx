import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Palette, Paintbrush, Copy, RefreshCw, Check } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

const HowToUseSection = () => {
 return (
   <Card className="mb-8">
     <CardContent className="p-6">
       <h2 className="text-lg font-semibold mb-4">How to Use</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="flex space-x-3">
           <div className="flex-shrink-0">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
               <Paintbrush className="w-4 h-4 text-blue-600" />
             </div>
           </div>
           <div>
             <h3 className="font-medium mb-1">컬러 선택</h3>
             <p className="text-sm text-gray-600">메인 컬러를 클릭해 피커를 사용하거나 &apos;Random&apos; 버튼으로 새로운 컬러를 선택하세요.</p>
           </div>
         </div>

         <div className="flex space-x-3">
           <div className="flex-shrink-0">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
               <Copy className="w-4 h-4 text-blue-600" />
             </div>
           </div>
           <div>
             <h3 className="font-medium mb-1">코드 복사</h3>
             <p className="text-sm text-gray-600">컬러를 클릭하면 HEX값이 클립보드에 자동으로 복사됩니다.</p>
           </div>
         </div>

         <div className="flex space-x-3">
           <div className="flex-shrink-0">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
               <RefreshCw className="w-4 h-4 text-blue-600" />
             </div>
           </div>
           <div>
             <h3 className="font-medium mb-1">팔레트 활용</h3>
             <p className="text-sm text-gray-600">자동으로 생성된 컬러 팔레트를 확인하고 활용하세요.</p>
           </div>
         </div>
       </div>
     </CardContent>
   </Card>
 );
};

const ColorConverter = ({ color = '#000000' }) => {
 const [copiedField, setCopiedField] = useState(null);
 const [rgb, setRgb] = useState([0, 0, 0]);

 const hexToRgb = (hex) => {
   hex = hex.replace('#', '');
   if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
     return [0, 0, 0];
   }
   const r = parseInt(hex.slice(0, 2), 16);
   const g = parseInt(hex.slice(2, 4), 16);
   const b = parseInt(hex.slice(4, 6), 16);
   return [r, g, b];
 };

 useEffect(() => {
   setRgb(hexToRgb(color));
 }, [color]);

 const copyToClipboard = (text, field) => {
   navigator.clipboard.writeText(text);
   setCopiedField(field);
   setTimeout(() => setCopiedField(null), 1500);
 };

 return (
   <div className="flex flex-col sm:flex-row gap-4">
     <div className="relative group flex-1">
       <div className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow">
         <div className="flex justify-between items-center">
           <span className="text-sm font-medium text-gray-600">HEX</span>
           <button
             onClick={() => copyToClipboard(color, 'HEX')}
             className="opacity-0 group-hover:opacity-100 transition-opacity"
           >
             {copiedField === 'HEX' ? (
               <Check className="w-4 h-4 text-green-500" />
             ) : (
               <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
             )}
           </button>
         </div>
         <div className="font-mono text-sm">
           {color.toUpperCase()}
         </div>
       </div>
     </div>

     <div className="relative group flex-1">
       <div className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow">
         <div className="flex justify-between items-center">
           <span className="text-sm font-medium text-gray-600">RGB</span>
           <button
             onClick={() => copyToClipboard(`rgb(${rgb.join(', ')})`, 'RGB')}
             className="opacity-0 group-hover:opacity-100 transition-opacity"
           >
             {copiedField === 'RGB' ? (
               <Check className="w-4 h-4 text-green-500" />
             ) : (
               <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
             )}
           </button>
         </div>
         <div className="font-mono text-sm">
           rgb({rgb.join(', ')})
         </div>
       </div>
     </div>
   </div>
 );
};

export default function ColorTool() {
 const [mainColor, setMainColor] = useState('#3B82F6');
 const [palette, setPalette] = useState([]);
 const [copyMessage, setCopyMessage] = useState('');

 useEffect(() => {
   document.title = "컬러 도구 - 마케팅 도구 모음";
 }, []);


 const hexToHSL = (hex) => {
   let r = parseInt(hex.slice(1, 3), 16) / 255;
   let g = parseInt(hex.slice(3, 5), 16) / 255;
   let b = parseInt(hex.slice(5, 7), 16) / 255;

   const max = Math.max(r, g, b);
   const min = Math.min(r, g, b);
   let h, s, l = (max + min) / 2;

   if (max === min) {
     h = s = 0;
   } else {
     const d = max - min;
     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
     switch (max) {
       case r: h = (g - b) / d + (g < b ? 6 : 0); break;
       case g: h = (b - r) / d + 2; break;
       case b: h = (r - g) / d + 4; break;
     }
     h /= 6;
   }

   return [h * 360, s * 100, l * 100];
 };

 const hslToHex = (h, s, l) => {
   l /= 100;
   const a = s * Math.min(l, 1 - l) / 100;
   const f = n => {
     const k = (n + h / 30) % 12;
     const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
     return Math.round(255 * color).toString(16).padStart(2, '0');
   };
   return `#${f(0)}${f(8)}${f(4)}`;
 };

 const generatePalette = (hex) => {
   const [h, s, l] = hexToHSL(hex);
   return [
     hex,
     hslToHex(h, s, l - 20),
     hslToHex(h, s - 20, l),
     hslToHex(h, s, l + 20),
     hslToHex(h, s + 20, l),
   ];
 };

 const generateComplementary = (hex) => {
   const [h, s, l] = hexToHSL(hex);
   const complementaryH = (h + 180) % 360;
   return [
     hex,
     hslToHex(complementaryH, s, l)
   ];
 };

 const generateSplitComplementary = (hex) => {
   const [h, s, l] = hexToHSL(hex);
   return [
     hex,
     hslToHex((h + 150) % 360, s, l),
     hslToHex((h + 210) % 360, s, l)
   ];
 };

 const generateAnalogous = (hex) => {
   const [h, s, l] = hexToHSL(hex);
   return [
     hslToHex((h - 30 + 360) % 360, s, l),
     hex,
     hslToHex((h + 30) % 360, s, l)
   ];
 };

 const generateTriadic = (hex) => {
   const [h, s, l] = hexToHSL(hex);
   return [
     hex,
     hslToHex((h + 120) % 360, s, l),
     hslToHex((h + 240) % 360, s, l)
   ];
 };

 const generateTetradic = (hex) => {
   const [h, s, l] = hexToHSL(hex);
   return [
     hex,
     hslToHex((h + 90) % 360, s, l),
     hslToHex((h + 180) % 360, s, l),
     hslToHex((h + 270) % 360, s, l)
   ];
 };

 useEffect(() => {
   setPalette(generatePalette(mainColor));
 }, [mainColor]);

 const copyToClipboard = (color) => {
   navigator.clipboard.writeText(color);
   setCopyMessage(`${color} 복사됨!`);
   setTimeout(() => setCopyMessage(''), 2000);
 };

 const generateRandomColor = () => {
   const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
   setMainColor(randomColor);
 };

 const ColorPaletteItem = ({ color }) => (
   <div className="space-y-2">
     <div
       className="h-24 rounded-lg shadow-sm cursor-pointer transition-transform hover:scale-105"
       style={{ backgroundColor: color }}
       onClick={() => copyToClipboard(color)}
     />
     <div className="flex items-center justify-between px-1">
       <span className="font-mono text-sm">{color.toUpperCase()}</span>
       <button
         onClick={() => copyToClipboard(color)}
         className="text-gray-500 hover:text-gray-700"
       >
         <Copy className="w-4 h-4" />
       </button>
     </div>
   </div>
 );

 return (
   <div className="container mx-auto px-4 py-8 max-w-6xl">
     <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
       ← 메인으로 돌아가기
     </Link>


     <div className="flex items-center mb-8 space-x-3">
       <div className="p-2 rounded-full bg-blue-50">
         <Palette className="w-6 h-6 text-blue-600" />
       </div>
       <h1 className="text-2xl font-bold">컬러 도구</h1>
     </div>

     <HowToUseSection />

     <Card className="mb-6">
       <CardContent className="p-6 space-y-8">
         <div className="flex flex-col md:flex-row md:items-start gap-6">
           <div className="relative">
             <input
               type="color"
               value={mainColor}
               onChange={(e) => setMainColor(e.target.value)}
               className="w-32 h-32 rounded cursor-pointer"
             />
             <span className="absolute -bottom-6 left-0 text-sm text-gray-500">메인 컬러</span>
           </div>

           <div className="space-y-6 flex-1">
             <div className="space-y-4">
               <h3 className="font-semibold">컬러 코드</h3>
               <ColorConverter color={mainColor} />
             </div>

             <button
               onClick={generateRandomColor}
               className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
             >
               <RefreshCw className="w-4 h-4" />
               <span>랜덤 컬러</span>
             </button>
           </div>
         </div>

         <div className="space-y-8">
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="font-semibold">기본 팔레트</h3>
               <p className="text-sm text-gray-500">선택한 색상의 밝기와 채도를 조절한 변형</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               {palette.map((color, index) => (
                 <ColorPaletteItem key={index} color={color} />
               ))}
             </div>
           </div>

           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="font-semibold">보색 조합</h3>
               <p className="text-sm text-gray-500">색상환에서 정반대에 위치한 색상</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
               {generateComplementary(mainColor).map((color, index) => (
                 <ColorPaletteItem key={index} color={color} />
               ))}
             </div>
           </div>

           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="font-semibold">분할 보색</h3>
               <p className="text-sm text-gray-500">보색의 양옆 색상을 활용한 부드러운 대비</p>
             </div>
             <div className="grid grid-cols-3 gap-4">
               {generateSplitComplementary(mainColor).map((color, index) => (
                 <ColorPaletteItem key={index} color={color} />
               ))}
             </div>
           </div>

           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="font-semibold">유사 색상</h3>
               <p className="text-sm text-gray-500">색상환에서 이웃한 자연스러운 조화</p>
             </div>
             <div className="grid grid-cols-3 gap-4">
               {generateAnalogous(mainColor).map((color, index) => (
                 <ColorPaletteItem key={index} color={color} />
               ))}
             </div>
           </div>

           <div className="space-y-4">
           <div className="flex justify-between items-center">
             <h3 className="font-semibold">삼각 배색</h3>
             <p className="text-sm text-gray-500">색상환에서 120도씩 떨어진 세 색상의 균형잡힌 조화</p>
           </div>
           <div className="grid grid-cols-3 gap-4">
             {generateTriadic(mainColor).map((color, index) => (
               <ColorPaletteItem key={index} color={color} />
             ))}
           </div>
         </div>

         <div className="space-y-4">
           <div className="flex justify-between items-center">
             <h3 className="font-semibold">사각 배색</h3>
             <p className="text-sm text-gray-500">색상환에서 90도씩 떨어진 네 색상의 다양한 조합</p>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {generateTetradic(mainColor).map((color, index) => (
               <ColorPaletteItem key={index} color={color} />
             ))}
           </div>
         </div>
       </div>
     </CardContent>
   </Card>

   {copyMessage && (
     <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
       {copyMessage}
     </div>
   )}
 </div>
);
}
