import Image from "next/image";

const CustomIcon = ({ name, size = 20, className = "" }) => {
  const iconMap = {
    robot: "/images/Robo-calculadora.webp",
    chart: "/images/Robo-grafico.png",
    wallet: "/images/Robo do mal.png",
    graph: "/images/Robo-grafico.png",
  };

  const iconPath = iconMap[name];
  
  if (!iconPath) {
    // Fallback para SVG se não encontrar a imagem
    return (
      <svg className={`w-${size} h-${size} ${className}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    );
  }

  return (
    <Image
      src={iconPath}
      alt={name}
      width={size}
      height={size}
      className={`rounded ${className}`}
    />
  );
};

export default CustomIcon;
