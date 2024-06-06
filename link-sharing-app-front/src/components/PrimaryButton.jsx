import "../styles/components/PrimaryButton.css";
import { useNavigate } from "react-router-dom";

export default function PrimaryButton({ text, type, link }) {
  const navigate = useNavigate();


  const handleClick = () => {
    navigate(`${link}`)
  }


  return (
    <div>
      <button type={type} className="primary-button" onClick={handleClick}>
        {text}
      </button>
    </div>
  );
}
