export default function resourceString(resource, cClass) {
    switch (cClass) {
        case "Battlebro":
            if (resource.category === "Verb") {
                return resource.special + " " + resource.type;
            } else {
                return resource.type + " of " + resource.special;
            }
        case "Bowslinger":
            return resource + " Ammo"
        case "Knight of Tushuze":
            return "Blessing of " + resource
        case "Mixologist":
            return resource.comp ? resource.catalyst.comp : resource
        case "Ragesmasher":
            return resource + " Totem"
        case "Runegoon":
            return resource.word
        case "Wizcaster":
            return resource.word + `(${resource.wordCat})`
        case "Zoomaster":
            return `"${resource.name}", ${resource.beast}`
        default:
            return resource
    }
}