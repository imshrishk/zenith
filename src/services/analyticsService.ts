import { logAnalyticsEvent } from '../config/firebase';

export const trackPageView = (pageName: string) => {
  logAnalyticsEvent('page_view', {
    page_name: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname
  });
};

export const trackMeditationStart = (meditationType: string, duration: number) => {
  logAnalyticsEvent('meditation_start', {
    meditation_type: meditationType,
    duration: duration
  });
};

export const trackMeditationComplete = (meditationType: string, duration: number) => {
  logAnalyticsEvent('meditation_complete', {
    meditation_type: meditationType,
    duration: duration
  });
};

export const trackThreadCreate = () => {
  logAnalyticsEvent('thread_create');
};

export const trackQuestionAsk = () => {
  logAnalyticsEvent('question_ask');
};

export const trackAnswerSubmit = () => {
  logAnalyticsEvent('answer_submit');
};

export const trackUserEngagement = (action: string, contentType: string) => {
  logAnalyticsEvent('user_engagement', {
    action,
    content_type: contentType
  });
};