import dotenv from "dotenv"
import axios from "axios"

dotenv.config()

const BASE_URL: string = "https://api.stackexchange.com/2.3/"
const SITE_PARAM: string = "&site=stackoverflow"
const KEY_PARAM: string = `&key=${process.env.API_KEY}`
const PAGE_SIZE: number = 100
const PAGE_SIZE_PARAM: string = `pagesize=${PAGE_SIZE}`
let endpoint: string;

interface Badge {
    name: string                // Badge name
    badgeId: number,           // ID
    rank: string,               // bronze | silver | gold
    badgeType: string,         // Badge type: named | tag_based
    description: string,        // Badge description, when did users get the badge
    awardCount: number,        // How many people get this badge
    link: string,               // Badge link
}

const fetchBadges = async () => {
    endpoint = "filters/create?"
    const INCLUDE_PARAM = "include=badge.description"
    const CREATE_FILTER_URL = BASE_URL + endpoint + INCLUDE_PARAM + KEY_PARAM

    return axios.post(CREATE_FILTER_URL)
        .then(async (response) => {
            const filterId: string = response.data.items[0].filter

            const url = BASE_URL + "badges/name?" + PAGE_SIZE_PARAM + "&sort=rank" + SITE_PARAM + KEY_PARAM + `&filter=${filterId}`
            try {
                const response_1 = await axios.get(url)
                const badges = response_1.data.items
                return badges.map((badge: any): Badge => ({
                    name: badge.name,
                    badgeId: badge.badge_id,
                    rank: badge.rank,
                    badgeType: badge.badge_type,
                    description: badge.description,
                    awardCount: badge.award_count,
                    link: badge.link
                }))
            } catch (error) {
                console.log(error)
            }
        })
        .catch(error => {
            console.error(error);
        });
}


fetchBadges()
    .then(badges => {
        console.log(badges)
    })
    .catch(error => {
        return error
    });