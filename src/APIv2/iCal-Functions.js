//Import iCal parser module & config file for sensitive information
const ical = require("node-ical");
const config = require("../util/config.js")

const getCurrentCycleEvent = async () => {
  const Calendar = await ical.async.fromURL("https://calendar.google.com/calendar/ical/hollandhall.org_rqggarpb66eqmgm80dg7n8atqg%40group.calendar.google.com/public/basic.ics");
  const Today = await new Date()

  //For Loop to iterate through each CycleDayEvent in the Calendar. Asynchronous
  for await (const CycleDayEvent of Object.values(Calendar)) {

    //If statement to find the one CycleDayEvent that corresponds to Today's Date. Ignores time
    if (CycleDayEvent.start.toString().slice(0, 15) === Today.toString().slice(0, 15)) {
      //Once found a match, return CycleDayEvent back to the APIv2.js file
      return CycleDayEvent
    }
  }
}

const getRemainingClasses = async () => {
  const Calendar = await ical.async.fromURL(config.personalCalendar)
  const CurrentDateTime = await new Date();

  //Create an array to store all Classes
  const ClassArray = []

  //For Loop to iterate through each ClassEvent in the Calendar. Asynchronous
  for await (const ClassEvent of Object.values(Calendar)) {

    /* 
      If the event's start time is after now, but is today, then do this
      OR
      If the event's start time has passed, but it's end time has not, (currently ongoing event), do this
    */
    if ((ClassEvent.start >= CurrentDateTime && ClassEvent.start.toISOString().split("T").slice(0, -1)[0] === CurrentDateTime.toISOString().split("T").slice(0, -1)[0]) || (ClassEvent.start <= CurrentDateTime && ClassEvent.end >= CurrentDateTime)) {

      //Add said ClassEvent Object into the array of Classes
      ClassArray.push(ClassEvent)
    }
  }

  //Once completed, return the array of all ClassEvents
  return ClassArray

}


//Extra function to convert UTC time to local time
const UTCtoLocalTime = (datetime) => {
  const formattedDate = new Date(datetime.getTime() + datetime.getTimezoneOffset() *60 * 1000);
        const offset = datetime.getTimezoneOffset() / 60;
        const hours = datetime.getHours();
        formattedDate.setHours(hours - offset);
        return formattedDate
}


//Exports all functions
module.exports = {
  getCurrentCycleEvent,
  getRemainingClasses,
  UTCtoLocalTime
}