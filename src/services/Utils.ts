import { v4 } from 'uuid'
import axios, { AxiosError } from 'axios'
import readlineModule from 'readline'

const uuid = () => {
  return v4()
}
const esperar = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const base64ToCaptchaSei = async (base64: string) => {
  const form = new FormData()
  form.append('authtoken', 'Oi23a033F0UK9gx41DaWG5IvWF45Y8379q93BruqA2Y8B3MN6x3UlN891105G6B6Y7Oz0E89JkooqmvmQ62H70L1Q084Ruqr8X7I3UawYbiH5qLBPvGW170kC64W6lsBV8D4ORb80e3mMrTK2hmF5lSx87TS')
  form.append('captchafile', `base64:${base64}`)

  const captcha = await axios.post('http://api.dbcapi.me/api/captcha', form).then(res => res.data?.text)
  return captcha as string
}
const base64ToCaptchaProcesso = async (base64: string) => {
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
}
const pegaCaptchaProcesso = async (taskId: string): Promise<string> => {
  console.log('pegaCaptchaProcesso')
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
const captchaManual = () => {
  console.log('Digite o Captcha')
  return new Promise<string>(resolve => {
    readlineModule.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    let captcha = ''
    process.stdin.on('keypress', (charater, key) => {
      captcha += charater
      console.log(captcha)
      if (captcha.length === 4) {
        process.stdin.setRawMode(false);
        return resolve(captcha)
      }
    })
  })
}
export {
  uuid,
  esperar,
  base64ToCaptchaProcesso,
  base64ToCaptchaSei,
  captchaManual
}
