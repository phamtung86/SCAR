import '../../assets/style/notice/success.scss'
const Success = ({ title, content, type }) => {
   
    return (
        <div className={`alert alert-2-${type}`}>
            <h3 className="alert-title">{title}</h3>
            <p className="alert-content">{content}</p>
        </div>
    )
}

export default Success;