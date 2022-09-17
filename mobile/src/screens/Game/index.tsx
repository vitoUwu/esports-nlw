import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons'

import { Background } from '../../components/Background';
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { DuoMatch } from '../../components/DuoMatch';

import { GameParams } from '../../@types/navigation';

import logoImg from '../../assets/logo-nlw-esports.png'
import { styles } from './styles';
import { THEME } from '../../theme';

export function Game() {
	
	const navigator = useNavigation();

	function handleBack() {
		navigator.goBack();
	}

	const route = useRoute();
	const game = route.params as GameParams;

	const [duos, setDuos] = useState<DuoCardProps[]>([])
	const [discordDuoSelected, setDiscordDuoSelected] = useState<string>('')

	async function getDiscordUser(adsId: string) {
		fetch(`http://192.168.0.100:3000/ads/${adsId}/discord`)
			.then(res => res.json())
			.then(data => setDiscordDuoSelected(data.discord));
	}

	useEffect(() => {
		fetch(`http://192.168.0.100:3000/games/${game.id}/ads`)
			.then(res => res.json())
			.then(data => setDuos(data));
	});

	return (
		<Background>
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity onPress={handleBack}>
						<Entypo 
							name='chevron-thin-left'
							color={THEME.COLORS.CAPTION_300}
							size={20}
						/>
					</TouchableOpacity>

					<Image
						source={logoImg}
						style={styles.logo}
					/>

					<View style={styles.right}/>
				</View>

				<Image
					source={{ uri: game.bannerUrl }}
					style={styles.cover}
					resizeMode='cover'
				></Image>

				<Heading
					title={game.title}
					subtitle='Conecte-se e comece a jogar!' 
				/>

				<FlatList
					data={duos}
					keyExtractor={item => item.id}
					renderItem={({item}) => (
						<DuoCard data={item} onConnect={() => getDiscordUser(item.id)}/>
					)}
					horizontal
					style={styles.containerList}
					contentContainerStyle={duos.length ? styles.contentList : styles.emptyListContent}
					showsHorizontalScrollIndicator={false}
					ListEmptyComponent={() => (
						<Text style={styles.emptyListText}>
							Não há anúncios publicados para esse jogo ainda
						</Text>
					)}
				/>

				<DuoMatch
					onClose={() => setDiscordDuoSelected('')}
					visible={discordDuoSelected.length > 0}
					discord={discordDuoSelected}
				/>
			</SafeAreaView>
		</Background>
  );
}