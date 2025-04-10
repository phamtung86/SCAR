import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import "../assets/style/ConnectionStatus.css";
const ConnectionStatus = ({ isConnected }) => {

    return (
        <>
            <motion.div
                initial={{ y: isConnected ? 0 : -50, opacity: 0 }}
                animate={{ y: isConnected ? -150 : 10, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: isConnected ? 0.3 : 0.7, ease: "easeInOut" }}
                className="connection-status"
            >
                <FontAwesomeIcon icon={faArrowsRotate} spin className="icon_connect"/> Đang kết nối với máy chủ...
            </motion.div>
        </>

    );
};

export default ConnectionStatus;
