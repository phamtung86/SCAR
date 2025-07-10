const changeTransmission = (transmission: string) => {
    switch (transmission) {
      case "AUTOMATIC":
        return "Tự động";
      case "MANUAL":
        return "Số sàn";
      case "CVT":
        return "Hộp số vô cấp (CVT)";
      case "OTHER":
        return "Khác";
      default:
        return "Không xác định";
    }
  }

  const changeFuelType = (fuelType: string) => {
    switch (fuelType) {
      case "GASOLINE":
        return "Xăng";
      case "DIESEL":
        return "Dầu";
      case "ELECTRIC":
        return "Điện";
      case "HYBRID":
        return "Hybrid";
      case "OTHER":
        return "Khác";
      default:
        return "Không xác định";
    }
  }

  const changeCarType = (carType: string) => {
    switch (carType) {
        case "SEDAN":
            return "Sedan";
        case "SUV":
            return "SUV";
        case "HATCHBACK":
            return "Hatchback";
        case "PICKUP":
            return "Pickup";
        case "COUPE":
            return "Coupe";
        case "CONVERTIBLE":
            return "Convertible";
        case "VAN":
            return "Van";
        case "WAGON":
            return "Wagon";
        case "OTHER":
            return "Khác";
        default:
            return "Không xác định";
        }
    }

    const changeCarCondition = (carCondition: string) => {
        switch (carCondition) {
            case "NEW":
                return "Mới";
            case "USED":
                return "Đã qua sử dụng";
            case "LIKE_NEW":
                return "Như mới";
            case "FAIR":
                return "Bình thường";
            default:
                return "Không xác định";
        }
    }
  export const CarUtils = {
    changeTransmission,
    changeFuelType,
    changeCarType,
    changeCarCondition
  };
