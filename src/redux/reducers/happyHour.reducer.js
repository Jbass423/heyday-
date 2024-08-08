const happy = (state = [], action) => {
    switch (action.type) {
        case "SET_HAPPY_SUCCESS":
            return action.payload.map(item => ({
                ...item,
                likes: parseInt(item.likes, 10) || 0,
                interested: parseInt(item.interested, 10) || 0,
                userLiked: false,
                userInterested: false
            }));
        case "ADD_HAPPY_SUCCESS":
            return [...state, {
                ...action.payload,
                likes: parseInt(action.payload.likes, 10) || 0,
                interested: parseInt(action.payload.interested, 10) || 0,
                userLiked: false,
                userInterested: false
            }];
        case "DELETE_HAPPY_SUCCESS":
            return state.filter((fav) => fav.id !== action.payload);
            case "UPDATE_LIKE":
                case "UPDATE_LIKE_SUCCESS":
                    return state.map((item) =>
                        item.id === action.payload.id
                            ? { ...item, likes: parseInt(action.payload.likes, 10) || item.likes, userLiked: true }
                            : item
                    );
                case "UNLIKE":
                    return state.map((item) =>
                        item.id === action.payload.id
                            ? { ...item, likes: Math.max(0, parseInt(item.likes, 10) - 1), userLiked: false }
                            : item
                    );
            case "UPDATE_LIKE":
                case "UPDATE_LIKE_SUCCESS":
                    return state.map((item) =>
                        item.id === action.payload.id
                            ? { ...item, likes: parseInt(action.payload.likes, 10) || item.likes, userLiked: action.payload.userLiked }
                            : item
                    );
                
                case "UPDATE_INT":
                case "UPDATE_INT_SUCCESS":
                    return state.map((item) =>
                        item.id === action.payload.id
                            ? { ...item, interested: parseInt(action.payload.interested, 10) || item.interested, userInterested: action.payload.userInterested }
                            : item
                    );
        default:
            return state;
    }
};

export default happy;