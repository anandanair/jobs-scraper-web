export default function Loader() {
  const keyframes = `
    @keyframes rotate-one {
      0% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg); }
      100% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); }
    }
    @keyframes rotate-two {
      0% { transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg); }
      100% { transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg); }
    }
    @keyframes rotate-three {
      0% { transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg); }
      100% { transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div
        className="absolute w-16 h-16 rounded-full"
        style={{
          top: "calc(50% - 32px)",
          left: "calc(50% - 32px)",
          perspective: "800px",
        }}
      >
        <div
          className="absolute w-full h-full rounded-full border-b-2"
          style={{
            borderBottomColor: "var(--color-navy-700)",
            left: "0%",
            top: "0%",
            animation: "rotate-one 1s linear infinite",
          }}
        />
        <div
          className="absolute w-full h-full rounded-full border-r-2"
          style={{
            borderRightColor: "var(--color-navy-700)",
            right: "0%",
            top: "0%",
            animation: "rotate-two 1s linear infinite",
          }}
        />
        <div
          className="absolute w-full h-full rounded-full border-t-2"
          style={{
            borderTopColor: "var(--color-navy-700)",
            right: "0%",
            bottom: "0%",
            animation: "rotate-three 1s linear infinite",
          }}
        />
      </div>
    </>
  );
}
