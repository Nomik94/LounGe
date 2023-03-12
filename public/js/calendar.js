(function () {
  $(function () {
    // calendar element 취득
    let calendarEl = $('#calendar')[0];
    // full-calendar 생성하기
    let calendar = new FullCalendar.Calendar(calendarEl, {
      height: '700px', // calendar 높이 설정
      expandRows: true, // 화면에 맞게 높이 재설정
      slotMinTime: '00:00', // Day 캘린더에서 시작 시간
      slotMaxTime: '23:59', // Day 캘린더에서 종료 시간
      headers: {},
      // 해더에 표시할 툴바
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listWeek',
      },
      initialView: 'dayGridMonth', // 초기 로드 될때 보이는 캘린더 화면(기본 설정: 달)
      /** initialDate: '2021-07-15', // 초기 날짜 설정 (설정하지 않으면 오늘 날짜가 보인다.)**/
      navLinks: true, // 날짜를 선택하면 Day 캘린더나 Week 캘린더로 링크
      editable: false, // 수정 가능?
      selectable: true, // 달력 일자 드래그 설정가능
      nowIndicator: true, // 현재 시간 마크
      dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
      locale: 'ko', // 한국어 설정
      timeZone: 'UTC', // 시간설정 'local' 가능!
      eventAdd: function (obj) {
        // 이벤트가 추가되면 발생하는 이벤트
        const title = obj.event.title;
        const start = obj.event.startStr;
        const end = obj.event.endStr;
      },
      eventChange: function (obj) {
        // 이벤트가 수정되면 발생하는 이벤트
        console.log(obj);
      },
      eventRemove: function (obj) {
        // 이벤트가 삭제되면 발생하는 이벤트
        console.log(obj);
      },
      select: function (arg) {
        document.getElementById('event-name').value = ''
        document.getElementById('event-description').value = ''
        document.getElementById('event-add-end-time').checked = false
        document.getElementById('event-startdate').value = ''
        document.getElementById('event-enddate').value = ''
        document.getElementById('event-time-start').value = '00:00'
        document.getElementById('event-time-end').value = '00:00'
        document.getElementById('event-location').value = ''
        document.getElementById('event-latlng').value = ''
        localStorage.clear();

        const createEventButton = document.getElementById("createEventButton");
        createEventButton.click()
        const start = arg.startStr
        const end = arg.endStr
        localStorage.setItem('start', arg.startStr);
        localStorage.setItem('end', arg.endStr);

        document.getElementById('event-startdate').value = start
        document.getElementById('event-enddate').value = end
        
        // 캘린더에서 드래그로 이벤트를 생성할 수 있다.
        calendar.unselect();
      },
      // 이벤트
      events: [
        {
          title: 'title',
          start: '2023-01-05 01:00',
          end: '2023-01-05 04:00',
          color: 'red',
        },
        {
          title: 'title1',
          start: '2023-01-05',
          end: '2023-01-05',
          color: 'purple',
        },
      ],
    });
    // 캘린더 랜더링
    calendar.render();
  });
})();