export const fetchCampaigns = (callback) => {
    return $.ajax({
        method: "GET",
        url: "/api/campaigns",
    }).then(campaigns => callback(Object.assign([], Object.values(campaigns))));
};

export const fetchCampaign = (id, callback) => {
    return $.ajax({
        method: "GET",
        url: `/api/campaigns/${id}`
    }).then(campaign => callback(Object.assign({}, campaign)));
};

export const createCampaign = (campaign, callback) => {
    return $.ajax({
        method: "POST",
        url: "/api/campaigns",
        data: { campaign }
    })
    // .then(newCampaign => callback(Object.assign({}, newCampaign)));
}
