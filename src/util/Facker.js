const { getRandomInt } = require("./Helpers");
var random_name = require('random-indian-name');
var faker = require('faker');

const { customAlphabet } = require("nanoid");

const alphabet = "0123456789";
const nanoid = customAlphabet(alphabet, 12);

const maleName = [
  "Aarav",
  "Vihaan",
  "Vivaan",
  "Ananya",
  "Daya",
  "Advik",
  "Kabir",
  "Anaya",
  "Anan",
  "Vivaan",
  "Aditya",
  "Vivaan",
  "Vihban",
  "Arjun",
  "Vivaan",
  "Reyansh",
  "Mohammed",
  "Sai",
  "Arnav",
  "Aayan",
  "Krishna",
  "Ishaan",
  "Shaurya",
  "Atharva",
  "Advik",
  "Pranav",
  "Advaith",
  "Aaryan",
  "Dhruv",
  "Kabir",
  "Ritvik",
  "Aarush",
  "Kian",
  "Darsh",
  "Veer",
];
const femaleName = [
  "Saanvi",
  "Anya",
  "Aadhya",
  "Aaradhya",
  "Ananya",
  "Pari",
  "Anika",
  "Navya",
  "Angel",
  "Diya",
  "Myra",
  "Sara",
  "Iraa",
  "Ahana",
  "Anvi",
  "Prisha",
  "Riya",
  "Aarohi",
  "Anaya",
  "Akshara",
  "Eva",
  "Shanaya",
  "Kyra",
  "Siya",
];
const location = [
  {
    country: "BD",
    city: "Mirpur",
  },
  {
    country: "IN",
    city: "Kolkata",
  },
  {
    country: "BD",
    city: "Gulshan",
  },
  {
    country: "BD",
    city: "Mohakhali",
  },
  {
    country: "IN",
    city: "Mumbai",
  },
];

module.exports = class Facker {
  static fackeNameGenerate = (generateLength) => {
    let names = [];
    let getRandomIndexArray = Facker.getRandomIndex(generateLength, maleName.length);
    getRandomIndexArray.forEach(element=>{
      let guestParcent=getRandomInt(100)+1;
      let avaterParcent=getRandomInt(100)+1;
      let genderParcent=getRandomInt(100)+1;
      let selectedAvatarParcent=getRandomInt(100)+1;
      // console.log(avaterParcent);
      if(guestParcent<=40){ // 40 percent guest name
        if(selectedAvatarParcent<40){
          let randomAvater=getRandomInt(12)+1;
          names.push({name: `Guest_${nanoid()}`, pictureUrl:`https://ulka-penfight.s3.ap-south-1.amazonaws.com/${randomAvater}.jpg`});
        }else{
          names.push({name: `Guest_${nanoid()}`, pictureUrl:"https://ulka-profile-pics.s3.ap-south-1.amazonaws.com/DefaultProfilePicture.png"});

        }
      }else{
        if(avaterParcent<=35){ // 35 percent avater
          if(genderParcent%2==0){
            let randomAvater=getRandomInt(12)+1;
            names.push({name: random_name({gender: "male"}), pictureUrl:`https://ulka-penfight.s3.ap-south-1.amazonaws.com/${randomAvater}.jpg`});
          }else{
            let randomAvater=getRandomInt(52)+1;
            names.push({name: random_name({gender: "female"}), pictureUrl:`https://ulka-penfight.s3.ap-south-1.amazonaws.com/${randomAvater}.jpg`});
          }
        }else{
          if(genderParcent%2==0){
            names.push({name: random_name({gender: "male"}), pictureUrl:faker.image.imageUrl(100,100)});
          }else{
            names.push({name: random_name({gender: "female"}), pictureUrl:faker.image.imageUrl(100,100)});
          }
        }
      }
      // names.push({name: random_name({gender: "male"}), pictureUrl:`https://ulka-profile-pics.s3.ap-south-1.amazonaws.com/male/male_image_${element}.jpg`});
    })
    // for (var i = 0; i < getRandomIndexArray.length; i++) {
    //   console.log(i);
    //   names.push(maleName[i]);
    // }
    return names;
  };
  static maleNameGenerate = (generateLength) => {
    let names = [];
    let getRandomIndexArray = Facker.getRandomIndex(generateLength, maleName.length);
    getRandomIndexArray.forEach(element=>{
      let guest=40;
      let avater=20;

      let randomNumber=getRandomInt(100)+1;
      if(randomNumber<=40){ // 40 percent guest name
        names.push({name: `Guest_${nanoid()}`, pictureUrl:"https://ulka-profile-pics.s3.ap-south-1.amazonaws.com/DefaultProfilePicture.png"});
      }else{
        if(randomNumber<=20){ // 20 percent avater
          names.push({name: random_name({gender: "male"}), pictureUrl:faker.image.imageUrl(100,100)});
        }else{
          names.push({name: random_name({gender: "male"}), pictureUrl:faker.image.imageUrl(100,100)});
        }
      }
      // names.push({name: random_name({gender: "male"}), pictureUrl:`https://ulka-profile-pics.s3.ap-south-1.amazonaws.com/male/male_image_${element}.jpg`});
    })
    // for (var i = 0; i < getRandomIndexArray.length; i++) {
    //   console.log(i);
    //   names.push(maleName[i]);
    // }
    return names;
  };
  static femaleNameGenerate = (generateLength) => {
    let names = [];
    let getRandomIndexArray = Facker.getRandomIndex(generateLength, femaleName.length);
    getRandomIndexArray.forEach(element=>{
      let randomNumber=getRandomInt(100)+1;
      if(randomNumber%2==0){
        names.push({name: `Guest_${nanoid()}`, pictureUrl:"https://ulka-profile-pics.s3.ap-south-1.amazonaws.com/DefaultProfilePicture.png"});
      }else{
        // names.push({name: random_name({gender: "female"}), pictureUrl:`https://ulka-profile-pics.s3.ap-south-1.amazonaws.com/female/female_image_${element}.jpg`});
        names.push({name: random_name({gender: "female"}), pictureUrl:faker.image.imageUrl(100,100)});
      }
    })
    return names;
  };
  static locationGenerate = () => {
    let index = getRandomInt(location.length);
    return location[index];
  };

   static getRandomIndex = (generateLength, arrayLength) => {
    let newIndexArray = [];
    let index = 0;
    for (var i = 0; i < generateLength; i++) {
      index = getRandomInt(arrayLength);
      while (newIndexArray.indexOf(index) !== -1) {
        index = getRandomInt(arrayLength);
      }
      newIndexArray.push(index);
    }
    return newIndexArray;
  };

  static targetXp = [
    50,
    100,
    150,
    150,
    200,
    250,
    300,
    300,
    350,
    400,
    450,
    450,
    500,
    550,
    600,
  ];
};
