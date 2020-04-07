export const fetchCampaigns = (callback) => {
    return $.ajax({
        method: "GET",
        url: "api/campaigns",
    }).then(campaigns => callback(Object.assign([], Object.values(campaigns))));
};