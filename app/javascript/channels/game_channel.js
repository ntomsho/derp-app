// import consumer from './consumer';

// consumer.subscriptions.create({ channel: "GameChannel", campaign: "Campaign" }, {
//     received(data) {
//         this.appendLine(data)
//     },

//     appendLine(data) {
//         const html = this.createLine(data)
//         const element = document.querySelector("[data-game-campaign='Campaign']")
//         element.insertAdjacentHTML("beforeend", html)
//     },

//     createLine(data) {
//         return `
//             <article class="game-line">
//                 <div>${data["sent_by"]}</div>
//                 <div>${data["body"]}</div> 
//             </article>
//         `
//     }
// })