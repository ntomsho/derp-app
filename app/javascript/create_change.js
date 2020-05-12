const createChangeObj = (charId, key, newValue, oldValue) => {
    let changeObj = {'charId': charId};

    switch (key) {
        case 'health':
        case 'experience':
            changeObj[key] = newValue - oldValue;
            break;
        case 'plotPoints':
            changeObj['plot_points'] = newValue - oldValue;
            break;
        case 'rest':
            changeObj[key] = true;
            break;
        case 'level_up':
            changeObj[key] = { new_level: newValue, advancement: oldValue }
            break;
        case 'dead':
            changeObj[key] = true;
            break;
        default:
            return;
    }

    return changeObj;
}

export default createChangeObj;
