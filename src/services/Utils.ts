import { v4 } from 'uuid'
import axios from 'axios'

const uuid = () => {
  return v4()
}
const esperar = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const base64ToCaptchaProcesso = async (base64: string) => {
  try {
    const data = {
      clientKey: 'f2fb58850fb4e0ee273a77025484c868',
      task: {
        type: 'ImageToTextTask',
        body: base64,
        Case: true,
        recognizingThreshold: 90
      }
    }
    const res = await axios.post('https://api.capmonster.cloud/createTask', data)
    const captcha = await pegaCaptchaProcesso(res.data.taskId)
    return captcha
  } catch (error) {
    console.log(error)
  }
}
const pegaCaptchaProcesso = async (taskId: string): Promise<string> => {
  esperar(1000)
  const response = await axios.post('https://api.capmonster.cloud/getTaskResult', {
    clientKey: 'f2fb58850fb4e0ee273a77025484c868',
    taskId
  })
  if (response.data.errorCode === 'ERROR_CAPTCHA_UNSOLVABLE') {
    return pegaCaptchaProcesso(taskId)
  }
  return response.data.solution.text
}
export {
  uuid,
  esperar,
  base64ToCaptchaProcesso,
}
