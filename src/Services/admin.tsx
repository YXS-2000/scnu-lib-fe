import { get } from '@/Utils/request'
import { serverUrl } from '@/Utils/config'

export const listuserApi = (page:number = 0,size:number = 20)=>{
    return get(`${serverUrl}/account​/accounts/`,{page,size})
}

export const listactParticipantsApi = (activityID:string,page:number,size:number) => {
    return get(`${serverUrl}/activity/activities/${activityID}/sign-up`,{activityID,page,size})
}