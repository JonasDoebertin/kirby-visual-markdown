<script>

    if(typeof VisualMarkdownTranslation == 'undefined') {
        var VisualMarkdownTranslation = {};
    }

    <?php foreach ($translation as $key => $value): ?>
        VisualMarkdownTranslation["<?php echo $key ?>"] = "<?php echo $value ?>";
    <?php endforeach ?>

</script>
