;(function () {
    var events = {};
    events.observers = {};

    events.trigger = function trigger(eventType, eventOptions, context) {
        setTimeout(function(){
            var observers = events.observers[eventType];
            var i;

            if (observers) {
                i = observers.length;
                while (i--) {
                    if (typeof observers[i] === 'function') {
                        observers[i].call(context, eventOptions);
                    }
                }
            }
        }, 0);

        return this;
    };

    events.subscribe = function subscribe(eventType, callback) {
        var observers = events.observers;

        if (!(eventType in observers)) {
            observers[eventType] = [];
        }

        observers[eventType].push(callback);

        return this;
    };

    window.events = events;
})();
