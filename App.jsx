import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Video from 'react-native-video';

function App() {
  const [videoToggle, setVideoToggle] = useState(false)
  const [videoPath, setVideoPath] = useState("")
  const camera = useRef(null)
  useEffect(() => {
    checkPermission()
  }, [])

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission()
    const newMicrophonePermission = await Camera.requestMicrophonePermission()
    const devices = await Camera.getAvailableCameraDevices()
    console.log(newCameraPermission, newMicrophonePermission, devices)
  }

  const devices = useCameraDevices('wide-angle-camera')
  console.log("devices : ", devices)
  const device = devices.back

  const captureImage = async () => {
    const photo = await camera.current.takePhoto({
      flash: 'on'
    })
    console.log("photo : ", photo)
  }

  const captureVideo = async () => {
    if (!videoToggle) {
      camera.current.startRecording({
        flash: 'on',
        onRecordingFinished: (video) => {
          console.log("video", video)
          setVideoPath(video.path)
        },
        onRecordingError: (error) => console.error("error", error),
      })
      setVideoToggle(true)
    } else {
      await camera.current.stopRecording()
    }
  }

  if (device == null) return <ActivityIndicator />
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!videoPath ? <View style={{
        flex: 1, alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          video={true}
          audio={true}
          photo={true}
        />
        <TouchableOpacity onPress={captureVideo} style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#FFF",
          position: 'absolute',
          bottom: 50,
        }} />
        <Image source={require('./assets/good_morning.png')} style={{
          width: 200,
          height: 60,
          position: 'absolute',
          bottom: 150,
        }} />
      </View> : <View style={{
        flex: 1, alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Video source={{ uri: videoPath }} style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }} />
        <Image source={require('./assets/good_morning.png')} style={{
          width: 200,
          height: 60,
          position: 'absolute',
          bottom: 150,
        }} />
      </View>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

});

export default App;
