import * as firebase from "firebase"
import { call } from "react-native-reanimated"
import { firebaseConfig } from "../config/firebase"

class Firebase {
    client = null

    database = {
        test: null,
        studentProfile: null,
        course: null,
        grade: null,
        teacherProfile: null,
        studentCourse: null,
        teacherCourse: null,
        setGrade: null
    }

    constructor() {
        if (!firebase.apps.length) {
            this.client = firebase.initializeApp(firebaseConfig)
        } else {
            this.client = firebase.app()
        }
    }

    //#region parsing
    parseStudentProfile = (student) => {
        const history = student.history?.map(function (history) {
            return {
                arithmetic1: history.arithmetic_1,
                arithmetic2: history.arithmetic_2,
                average1: history.average_1,
                average2: history.average_2,
                credits1: history.credits_1,
                nrCredits1: history.nr_credits_1,
                credits2: history.credits_2,
                nrCredits2: history.nr_credits_2,
                yearCredits: history.year_credits,
                yearNrCredits: history.year_nr_credits,
                studyYear: history.study_year,
                year: history.year,
                yearArithmetic: history.year_arithmetic,
                yearAverage: history.year_average
            }
        }).filter(history => history != null) || []

        return {
            address: student.address,
            bacalaureat: student.bacalaureat,
            birthCity: student.birth_city,
            birthCountry: student.birth_country,
            birthDate: student.birth_date,
            birthRegion: student.birth_region,
            citizenship: student.citizenship,
            city: student.city,
            cnp: student.cnp,
            country: student.country,
            currentStatus: student.current_status,
            dataAdmittance: student.data_admittance,
            email: student.email,
            environment: student.environment,
            fatherName: student.father_name,
            fi: student.fi,
            firstName: student.first_name,
            graduateYear: student.graduate_year,
            group: student.group,
            history: history,
            id: student.id,
            lastName: student.last_name,
            maritalStatus: student.marital_status,
            marriageName : student.marriage_name,
            matricolNr: student.matricol_nr,
            militaryStatus: student.military_status,
            minority: student.minority,
            motherName: student.mother_name,
            nationality: student.nationality,
            performance: student.performance,
            profileImage: student.profile_image,
            promotion: student.promotion,
            provenance: student.provenance,
            region: student.region,
            religion: student.religion,
            series: student.series,
            sex: student.sex,
            studyCategory: student.study_category,
            studyType: student.study_type,
            type: student.type,
            faculty: student.faculty,
            domain: student.domain,
            domainId: student.domain_id,
            speciality: student.speciality
        }
    }

    parseTeacherProfile = (teacher) => {
        return {
            email: teacher.email,
            firstName: teacher.first_name,
            lastName: teacher.last_name,
            profilePicture: teacher.profile_picture
        }
    }

    parseCourse = (course, ID, year) => {
        const courseArray = Object.keys(course).map((key) => course[key]);
        const courses = courseArray.map(function (course) {
            if(course.domain_id == ID && course.year == year) {
                return {
                    domainId: course.domain_id,
                    name: course.name,
                    teacherId: course.teacher_id,
                    year: course.year,
                    date: course.exam_date,
                    credits: course.credits,
                    courseId: course.course_id
                }
            }
        }).filter(course => course != null) || []

        return courses
    }    

    parseTeacherCourse = (course, teacherID) => {
        const courseArray = Object.keys(course).map((key) => course[key]);
        const courses = courseArray.map(function (course) {
            if(course.teacher_id == teacherID) {
                return {
                    domainId: course.domain_id,
                    name: course.name,
                    teacherId: course.teacher_id,
                    year: course.year,
                    date: course.exam_date,
                    credits: course.credits,
                    courseId: course.course_id
                }
            }
        }).filter(course => course != null) || []

        return courses
    }

    parseGrade = (grades, courseId, studentId) => {
        const fArray = Object.keys(grades).map((key) =>  grades[key]);
        const grade = fArray.map(function (grades) {
            if((grades.course_id == courseId) && ( grades.student_id == studentId )) {
                return {
                    value: grades.value,
                    nrCredits: grades.nr_credits,
                    data: grades.data
                }
            }
        }).filter(grades => grades != null) || []

        return grade
    }

    parseAllGrade = (grades, courseId) => {
        const gradesArray = Object.keys(grades).map((key) => grades[key]);
        const grade = gradesArray.map(function (grades) {
            if(grades.course_id == courseId) {
                return {
                    value: grades.value,
                    nrCredits: grades.nr_credits,
                    data: grades.data,
                    studentId: grades.student_id
                }
            }
        }).filter(grades => grades != null) || []

        return grade
    }

    parseStudentsByCourse = (students, domainId) => {
        var student = Object.keys(students).map((key) => [key, students[key]]);
        const result = student.map(function (student) {
           if(student[1].domain_id == domainId) {
                return {
                    idStudent: student[0],
                    lastName: student[1].last_name,
                    firstName: student[1].first_name,
                    email: student[1].email,
                }
            }
        }).filter(student => student != undefined) || []

        return result
    }

    parseMessages = (messages, cID) => {
        const messageSplit = Object.keys(messages).map((key) => messages[key]);
        const response = messageSplit.map((item) => {
            if(item.course_id == cID) {
                return item
            }
        }).filter(response => response != undefined)

        try {
            const finalM = Object.keys(response[0])?.map((key) => [key, response[0][key]])
            return finalM
        } catch (err) {
            console.log(err)
            return []
        }
    }

    parseFilesByCourse = (files) => {
        const filesSplit = Object.keys(files.files).map((key) => files.files[key]);
        return filesSplit
    }
    //#endregion

    //#region subscribe
    subscribeTest = (callback) => {
        if (this.database.test) {
            this.database.test.off()
        } else {
            this.database.test = this.client.database().ref(`tests`)
        }

        this.database.test.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const tests = Object.values(snapshot.val()).map((test) => {    
                    return test
                })

                return callback(tests)
            }

            callback([])
        })
    }

    getStudentProfile = (studentId, callback) => {
        this.database.studentProfile = this.client.database().ref(`students/${ studentId }`)
        this.database.studentProfile.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const student = this.parseStudentProfile(snapshot.val())
                return callback(student)
            }

            callback(null)
        })
    }

    getTeacherProfile = (teacherId, callback) => {
        this.database.teacherProfile = this.client.database().ref(`teachers/${ teacherId }`)
        this.database.teacherProfile.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const teacher = this.parseTeacherProfile(snapshot.val())
                return callback(teacher)
            }

            callback(null)
        })
    }

    getCourse = (domainId, year,callback) => {
        this.database.course = this.client.database().ref(`courses`)
        this.database.course.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const course = this.parseCourse(snapshot.val(), domainId, year)
                return callback(course)
            }

            callback(null)
        })
    }

    getGrade = (courseId, studentId, callback) => {
        this.database.grade = this.client.database().ref(`grades`)
        this.database.grade.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const grade = this.parseGrade(snapshot.val(), courseId, studentId)
                return callback(grade)
            }

            callback(null)
        })
    }

    getAllGrade = (courseId, callback) => {
        this.database.grade = this.client.database().ref(`grades`)
        this.database.grade.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const grade = this.parseAllGrade(snapshot.val(), courseId)
                return callback(grade)
            }

            callback(null)
        })
    }

    getTeacherCourses = (teacherID, callback) => {
        this.database.course = this.client.database().ref(`courses`)
        this.database.course.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const course = this.parseTeacherCourse(snapshot.val(), teacherID)
                return callback(course)
            }

            callback(null)
        })
    }

    getStudentsByCourse = (domainId, callback) => {
        this.database.studentCourse = this.client.database().ref(`students`)
        this.database.studentCourse.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const student = this.parseStudentsByCourse(snapshot.val(), domainId)
                return callback(student)
            }

            callback(null)
        })
    }

    setGrade = (studentId, courseId, nota, today, callback) => {
        let check = false
        let con = this.client.database().ref(`grades`)
        con.once('value', (snapshot) => {
            if (snapshot.exists()) {
                try {
                    snapshot.forEach(function(child) {
                        if((child.val().course_id == courseId) && (studentId == child.val().student_id)) {
                            child.ref.update({
                                value: nota,
                                data: today
                            });

                            check = true

                            return callback(true)
                        }
                    })

                    if(!check) {
                        var newChildRef = con.push({ 
                            student_id: studentId,
                            course_id: courseId,
                            value: nota,
                            data: today,
                            nr_credits: '-'
                        });

                        return callback(true)
                    }
                    
                } catch(err) {    
                    return callback(false)
                }
            }
        })
    }

    chatCreate = (courseId, callback) => {
        let foundIt = false
        let con = this.client.database().ref(`chatRooms`)
        con.once('value', (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(function(child) {
                    if(child.val().course_id == courseId) {
                        foundIt = true
                        return callback('already')
                    }
                })
            }

            if(!foundIt) {
                if(!foundIt) {
                    var newChildRef = con.push({ 
                        course_id: courseId
                    });
                    
                    return callback(true)
                }
            }
        })

        callback(null)
    }

    chatDelete = (courseId, callback) => {
        let foundIt = false
        let con = this.client.database().ref(`chatRooms`)
        con.once('value', (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(function(child) {
                    if(child.val().course_id == courseId) {
                        foundIt = true
                        child.ref.remove()
                        return callback(true)
                    }
                })
            }

            if(!foundIt) {
                return callback('eroare')
            }
        })

        callback(null)
    }

    sendMessage = (courseId, text, hour, user, callback) => {
        let foundIt = false
        let message = {
            text: text,
            timestamp: hour,
            user: user
        }
        let con = this.client.database().ref(`chatRooms`)
        con.once('value', (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(function(child) {
                    if(child.val().course_id == courseId) {
                        foundIt = true
                        child.ref.push(message)
                    }
                })
            }

            if(!foundIt) {
                return callback('eroare')
            }
        })

        callback(null)
    }

    getMessages = (courseId, callback) => {
        let foundIt = false
        let con = this.client.database().ref(`chatRooms`)
        let messagesVal
        con.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const messages = this.parseMessages(snapshot.val(), courseId)
                callback(messages)
            }
        })

        callback(null)
    }

    addFileToCourse = (courseId, url, name, callback) => {
        let con = this.client.database().ref(`courses`)
        con.once('value', (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(function(child) {
                    if(child.val().course_id == courseId) {
                        if(child.hasChild('files')) {
                            child.child('files').ref.push({
                                url: url,
                                name: name
                            })  
                            callback(true);              
                        } else {
                            child.ref.update({
                                files: {
                                    1: {
                                        url: url,
                                        name: name
                                    }
                                }
                            });

                            callback(true)
                        }
                    }
                })
            }
        })

        callback(null)
    }

    getFileByCourse = (courseId, callback) => {
        let con = this.client.database().ref(`courses`)
        let filesVal = null
        con.on('value', (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(function(child) {
                    if(child.val().course_id == courseId) {
                        if(child.hasChild('files')) {
                            filesVal = child.val()
                        }
                    }
                })
            }

            if(filesVal != null) {
                callback(this.parseFilesByCourse(filesVal))
            }
        })

        callback(null)
    }

    //#endregion
}

const Client = new Firebase()
export default Client