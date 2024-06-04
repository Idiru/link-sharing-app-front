import "../styles/components/PrimaryButton.css"


export default function PrimaryButton({text, type}) {
  return (
    <div>
        <button type={type} className='primary-button'>{text}</button>
    </div>
  )
}
