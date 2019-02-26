const Discord = require('discord.js');
const goblinData = require('./goblin.json');
require('dotenv').config()

const client = new Discord.Client();

getRandomInData = (data) => {
  return data[Math.floor(Math.random() * data.length)]
}

createGoblin = () => {
  let data = {
    ocupation: getRandomOcupation(),
    coloration: getRandomColoration(),
    feature: getRandomFeature()
  }
  data.combat = data.ocupation.combat + data.coloration.combat;
  data.knowledge = data.ocupation.knowledge + data.coloration.knowledge;
  data.skill = data.ocupation.skill + data.coloration.skill;
  data.luck = data.ocupation.luck + data.coloration.luck;
  return data;
}
getRandomOcupation = () => {
  return getRandomInData(goblinData.ocupations);
}

getRandomColoration = () => {
  return getRandomInData(goblinData.colorations);
}

getRandomFeature = () => {
  let d = getRandomInData(goblinData.features);
  if (d.id === 6) {
    d.description = getAnomalies().join(", ");
  }
  return `${d.name} (${d.description})`;
}

getAnomalies = (anomalies = []) => {
  let dice_value = Math.floor((Math.random() * 10) + 2);
  if (dice_value <= 3) {
      anomalies.push(goblinData.anomalies[0]);
  } else if (dice_value > 3 && dice_value <= 10) {
      if (dice_value == 6) {
          let anomaly = goblinData.anomalies[5];
          anomaly.name = anomaly.name.replace("{0}", Math.floor((Math.random() * 6) + 1));
          anomalies.push(anomaly);
      } else {
          anomalies.push(goblinData.anomalies[dice_value - 2]);
      }
  } else if (dice_value > 10) {
      anomalies = this.getAnomalies(anomalies);
      anomalies = this.getAnomalies(anomalies);
  }
  return anomalies.map((g) => {
    return g.name
  });
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '~goblin') {
    let goblin = createGoblin();
    let message = `\`\`\`md
#JOGADOR: ${msg.author.tag}
#Ocupação: ${goblin.ocupation.name}
#Coloração: ${goblin.coloration.name}
#Caracteristica: ${goblin.feature}
========================================
#Combate: ${goblin.combat}
#Habilidade: ${goblin.skill}
#Conhecimento: ${goblin.knowledge}
#Sorte: ${goblin.luck}\`\`\``;
    message = message;
    msg.channel.send(message);
  }
});

client.login(process.env.DISCORD_TOKEN)