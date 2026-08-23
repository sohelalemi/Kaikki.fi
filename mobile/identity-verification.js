import {Alert} from 'react-native';

// Replaces the old generic "next version" placeholder for strong identity verification.
// Real Finnish bank authentication (FTN) must be connected through a contracted
// identity provider before this can redirect users to bank credentials.
const originalAlert=Alert.alert.bind(Alert);

Alert.alert=(title,message,buttons,options)=>{
  if(title==='Tunnistautuminen'&&message==='Tämä toiminto lisätään seuraavassa versiossa.'){
    return originalAlert(
      'Vahva tunnistautuminen',
      'Pankkitunnistautuminen valmistellaan Finnish Trust Network (FTN) -palvelun kautta. Ennen käyttöönottoa Kaikki.fi tarvitsee tunnistuspalveluntarjoajan sopimuksen ja tuotantoavaimet. Käyttäjää ei merkitä vahvistetuksi ilman oikeaa pankkitunnistautumista.',
      [{text:'OK'}]
    );
  }
  return originalAlert(title,message,buttons,options);
};
