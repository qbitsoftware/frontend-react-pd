const ads = [
  { url: "https://uus.lauatennis.ee/wp-content/uploads/2021/09/eadse_logo_full-1024x155.png" },
  { url: "https://uus.lauatennis.ee/wp-content/uploads/2023/05/RollmerFOTO.png" },
  { url: "https://uus.lauatennis.ee/wp-content/uploads/2024/10/EML_TT202425-2048x1205.png" },
  { url: "https://uus.lauatennis.ee/wp-content/uploads/2025/01/ELTL_banner25_801x396px.jpg" }
]

const Adboard = () => {
  return (
    <div className="flex flex-col space-y-4">
      {ads.map((ad, index) => (
        <img key={index} src={ad.url} />
      ))}
    </div>
  )
}

export default Adboard
