// // // VideoPlayer.js
// // import React, { useRef, useState, useEffect } from "react";

// // const VideoPlayer = ({ videoSrc }) => {
// //   const videoRef = useRef(null);
// //   const [watchedTime, setWatchedTime] = useState(0); // seconds
// //   const [duration, setDuration] = useState(0); // seconds
// //   const [completed, setCompleted] = useState(false);

// //   useEffect(() => {
// //     const video = videoRef.current;

// //     const handleTimeUpdate = () => {
// //       const currentTime = video.currentTime;
// //       setWatchedTime(currentTime);

// //       const percentWatched = (currentTime / duration) * 100;
// //       if (percentWatched >= 95 && !completed) {
// //         setCompleted(true);
// //       }
// //     };

// //     const handleLoadedMetadata = () => {
// //       setDuration(video.duration);
// //     };

// //     if (video) {
// //       video.addEventListener("loadedmetadata", handleLoadedMetadata);
// //       video.addEventListener("timeupdate", handleTimeUpdate);
// //     }

// //     return () => {
// //       if (video) {
// //         video.removeEventListener("loadedmetadata", handleLoadedMetadata);
// //         video.removeEventListener("timeupdate", handleTimeUpdate);
// //       }
// //     };
// //   }, [duration, completed]);

// //   const watchedMinutes = (watchedTime / 60).toFixed(2);
// //   const progress = duration > 0 ? ((watchedTime / duration) * 100).toFixed(2) : 0;

// //   return (
// //     <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
// //       <h2>🎓 Class Video</h2>
// //       <video ref={videoRef} width="100%" controls>
// //         <source src={videoSrc} type="video/mp4" />
// //         Your browser does not support the video tag.
// //       </video>

// //       <div style={{ marginTop: "15px", fontSize: "16px" }}>
// //         <p>⏱️ Watched Time: <strong>{watchedMinutes}</strong> minutes</p>
// //         <p>📊 Progress: <strong>{progress}%</strong></p>
// //         <p>✅ Status: <strong>{completed ? "Completed" : "In Progress"}</strong></p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default VideoPlayer;
// // VideoPlayer.js
// import React, { useRef, useState } from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import Video from 'react-native-video';

// const VideoPlayer = () => {
//   const videoRef = useRef(null);
//   const [watchedTime, setWatchedTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [completed, setCompleted] = useState(false);

//   const handleLoad = (meta) => {
//     setDuration(meta.duration);
//   };

//   const handleProgress = (progress) => {
//     const currentTime = progress.currentTime;
//     setWatchedTime(currentTime);

//     const percentWatched = (currentTime / duration) * 100;
//     if (percentWatched >= 95 && !completed) {
//       setCompleted(true);
//     }
//   };

//   const watchedMinutes = (watchedTime / 60).toFixed(2);
//   const progress = duration > 0 ? ((watchedTime / duration) * 100).toFixed(2) : 0;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🎓 Class Video</Text>

//       <Video
//         ref={videoRef}
//         source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
//         style={styles.video}
//         controls
//         resizeMode="contain"
//         onLoad={handleLoad}
//         onProgress={handleProgress}
//       />

//       <View style={styles.info}>
//         <Text>⏱️ Watched Time: <Text style={styles.bold}>{watchedMinutes}</Text> minutes</Text>
//         <Text>📊 Progress: <Text style={styles.bold}>{progress}%</Text></Text>
//         <Text>✅ Status: <Text style={styles.bold}>{completed ? 'Completed' : 'In Progress'}</Text></Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#fff',
//     flex: 1,
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 12,
//     fontWeight: '600',
//   },
//   video: {
//     width: Dimensions.get('window').width - 32,
//     height: 200,
//     backgroundColor: '#000',
//   },
//   info: {
//     marginTop: 16,
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
// });

// export default VideoPlayer;
