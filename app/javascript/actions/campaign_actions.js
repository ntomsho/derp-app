export const fetchCampaigns = (search_params, callback) => {
    return $.ajax({
        method: "GET",
        url: "/api/campaigns",
        data: { search_params }
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
    .then(newCampaign => callback(Object.assign({}, newCampaign)));
}

export const quitCampaign = (campaign_id, user_id, callback) => {
    return $.ajax({
        method: "DELETE",
        url: "/api/campaign_subs",
        data: { campaign_id, user_id }
    }).then((subId) => callback(subId));
}

export const deleteCampaign = (campaign_id, callback) => {
    return $.ajax({
        method: "DELETE",
        url: `/api/campaigns/${campaign_id}`
    }).then(() => callback());
};
