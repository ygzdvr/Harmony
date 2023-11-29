import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NotificationStyles from '../../constants/styles/NotificationStyles';
import COLORS from '../../constants/colors';
import {getDoc, doc} from 'firebase/firestore';
import {DB_FIREBASE, STORAGE} from '../../api/firebase/firebase';
import {get} from '../../api/util/get';
import moment from 'moment';
import {ref, getDownloadURL} from 'firebase/storage';

const NotificationView = ({navigation}) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const handleSelectUser = user => {
    navigation.navigate('DetailView', {
      userId: user.userId,
      profilePhoto: user.senderProfilePhoto,
    });
  };
  const goBack = () => {
    navigation.goBack();
  };
  useEffect(() => {
    const fetchPendingRequests = async () => {
      const currentUserUid = await get('@user_id');
      const userRef = doc(DB_FIREBASE, 'users', currentUserUid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const requests = userSnap.data().pendingFriends || [];
        const requestDetails = await Promise.all(
          requests.map(async request => {
            const senderRef = doc(DB_FIREBASE, 'users', request.userId);
            const senderSnap = await getDoc(senderRef);
            const senderData = senderSnap.exists() ? senderSnap.data() : {};
            //const senderProfilePhoto = await getDownloadURL(
            //  ref(STORAGE, `profilePhotos/${request.userId}`),
            //);

            return {
              ...request,
              senderName: senderData.name,
              senderUsername: senderData.username,
              //senderProfilePhoto,
            };
          }),
        );
        setPendingRequests(requestDetails);
      }
    };

    fetchPendingRequests();
  }, []);
  const categorizeRequests = () => {
    const today = moment();
    const categorizedRequests = {
      today: [],
      week: [],
      month: [],
      older: [],
    };

    pendingRequests.forEach(request => {
      const requestDate = moment(request.timestamp.toDate());
      if (requestDate.isSame(today, 'day')) {
        categorizedRequests.today.push(request);
      } else if (requestDate.isAfter(today.subtract(1, 'week'))) {
        categorizedRequests.week.push(request);
      } else if (requestDate.isAfter(today.subtract(1, 'month'))) {
        categorizedRequests.month.push(request);
      } else {
        categorizedRequests.older.push(request);
      }
    });

    return categorizedRequests;
  };
  const renderRequests = () => {
    const requests = categorizeRequests();
    if (
      requests.today.length === 0 &&
      requests.week.length === 0 &&
      requests.month.length === 0 &&
      requests.older.length === 0
    ) {
      return (
        <View style={NotificationStyles.sectionNoRequests}>
          <Text style={NotificationStyles.noRequests}>
            You have no pending requests!
          </Text>
        </View>
      );
    }
    return (
      <View>
        {renderRequestSection('Today', requests.today)}
        {renderRequestSection('This Week', requests.week)}
        {renderRequestSection('This Month', requests.month)}
        {renderRequestSection('Older', requests.older)}
      </View>
    );
  };

  const renderRequestSection = (title, requests) => {
    if (requests.length === 0) {
      return null;
    }

    return (
      <View style={NotificationStyles.section}>
        <Text style={NotificationStyles.sectionTitle}>{title}</Text>
        {requests.map((request, index) => (
          <TouchableOpacity
            onPress={() => handleSelectUser(request)}
            key={index}
            style={NotificationStyles.requestItem}>
            <Image
              source={{uri: request.senderProfilePhoto}}
              style={NotificationStyles.profilePhoto}
            />
            <View style={NotificationStyles.requestInfo}>
              <Text style={NotificationStyles.requestText}>
                {request.senderName}
              </Text>
              <Text style={NotificationStyles.requestUsername}>
                @{request.senderUsername}
              </Text>
            </View>
            <Text style={NotificationStyles.requestTime}>
              {moment(request.timestamp.toDate()).fromNow()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={NotificationStyles.container}>
      <TouchableOpacity
        onPress={() => goBack()}
        style={NotificationStyles.backButton}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      {renderRequests()}
    </ScrollView>
  );
};

export default NotificationView;
